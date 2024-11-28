const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/userModel'); 
const TokenUtils = require('../utils/tokenUtils');

class SocialAuthService {
    constructor() {
        this.initializeStrategies();
    }

    initializeStrategies() {
        // Google Strategy
        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/api/auth/google/callback",
            scope: ['profile', 'email']
        }, async function(accessToken, refreshToken, profile, done) {
            try {
                console.log('Google Profile:', profile);
                
                const email = profile.emails[0].value;
                let user = await User.findOne({ email });

                if (!user) {
                    user = await User.create({
                        email: email,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        googleId: profile.id,
                        isVerified: true,
                        profilePicture: profile.photos?.[0]?.value,
                        password: require('crypto').randomBytes(32).toString('hex') // Generate random password
                    });
                } else if (!user.googleId) {
                    user.googleId = profile.id;
                    await user.save();
                }

                // Generate JWT token
                const token = TokenUtils.generateToken({
                    userId: user._id,
                    roles: user.roles
                });

                // Add token to user object
                const userObject = user.toObject();
                userObject.token = token;
                
                return done(null, userObject);
            } catch (error) {
                console.error('Google Auth Error:', error);
                return done(error, null);
            }
        }));

        // Facebook Strategy
        passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: "/auth/facebook/callback",
            profileFields: ['id', 'emails', 'name']
        }, this.handleFacebookAuth));

        // GitHub Strategy
        passport.use(new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/api/auth/github/callback",
            scope: ['user:email']
        }, this.handleGithubAuth.bind(this)));

        passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        passport.deserializeUser(async (id, done) => {
            try {
                const user = await User.findById(id);
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        });
    }

    async handleGoogleAuth(accessToken, refreshToken, profile, done) {
        try {
            const email = profile.emails[0].value;
            let user = await User.findOne({ email });
            
            if (!user) {
                // Create new user from Google profile
                user = await User.create({
                    email,
                    firstName: profile.name.givenName || profile.displayName,
                    lastName: profile.name.familyName || 'Unknown',
                    password: require('crypto').randomBytes(32).toString('hex'),
                    isVerified: true,
                    googleId: profile.id,
                    profilePicture: profile.photos?.[0]?.value
                });
            }

            // Ensure user has an _id before generating token
            if (!user._id) {
                throw new Error('User ID not found');
            }

            // Generate token with proper user data
            const token = TokenUtils.generateToken({
                userId: user._id.toString(),
                email: user.email
            });

            // Add token and redirect URL to user object
            const userObject = user.toObject();
            userObject.token = token;
            userObject.redirectUrl = `${process.env.FRONTEND_URL}/dashboard`;

            return done(null, userObject);
        } catch (error) {
            console.error('Google Auth Error:', error);
            return done(error, null);
        }
    }

    async handleFacebookAuth(accessToken, refreshToken, profile, done) {
        try {
            let user = await User.findOne({ email: profile.emails[0].value });

            if (!user) {
                user = await User.create({
                    email: profile.emails[0].value,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    facebookId: profile.id,
                    verified: true
                });
            }

            const token = TokenUtils.generateToken(user);
            const userObject = user.toObject();
            userObject.token = token;
            userObject.redirectUrl = `${process.env.FRONTEND_URL}/dashboard`;

            return done(null, userObject);
        } catch (error) {
            return done(error, null);
        }
    }

    async handleGithubAuth(accessToken, refreshToken, profile, done) {
        try {
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            
            if (!email) {
                return done(new Error('No email found in GitHub profile'), null);
            }

            let user = await User.findOne({ email });

            if (!user) {
                // Split displayName into first and last name if possible
                let firstName = profile.displayName || profile.username;
                let lastName = '';
                
                if (profile.displayName && profile.displayName.includes(' ')) {
                    const nameParts = profile.displayName.split(' ');
                    firstName = nameParts[0];
                    lastName = nameParts.slice(1).join(' ');
                }

                // Create new user with a generated password
                user = await User.create({
                    email,
                    firstName,
                    lastName: lastName || 'Unknown', // Provide default lastName
                    githubId: profile.id,
                    password: require('crypto').randomBytes(32).toString('hex'), // Generate random password
                    isVerified: true,
                    profilePicture: profile.photos?.[0]?.value
                });
            }

            // Generate JWT token
            const token = TokenUtils.generateToken(user);
            if (!token) {
                throw new Error('Failed to generate token');
            }

            // Add token and redirect URL to user object
            const userObject = user.toObject();
            userObject.token = token;
            userObject.redirectUrl = `${process.env.FRONTEND_URL}/dashboard`;
            
            return done(null, userObject);
        } catch (error) {
            console.error('GitHub Auth Error:', error);
            return done(error, null);
        }
    }
}

module.exports = new SocialAuthService(); 