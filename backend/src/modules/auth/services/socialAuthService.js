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
            callbackURL: "/auth/google/callback"
        }, this.handleGoogleAuth));

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
            callbackURL: `${process.env.BACKEND_URL}/api/auth/github/callback`,
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
            let user = await User.findOne({ email: profile.emails[0].value });

            if (!user) {
                user = await User.create({
                    email: profile.emails[0].value,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    googleId: profile.id,
                    verified: true
                });
            }

            return done(null, user);
        } catch (error) {
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

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }

    async handleGithubAuth(accessToken, refreshToken, profile, done) {
        try {
            console.log('GitHub Profile:', profile);
            
            // Get primary email from GitHub profile
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            
            if (!email) {
                return done(new Error('No email found in GitHub profile'), null);
            }

            let user = await User.findOne({ email });

            if (!user) {
                // Create new user if doesn't exist
                user = await User.create({
                    email,
                    firstName: profile.displayName || profile.username,
                    lastName: '',
                    githubId: profile.id,
                    isVerified: true,
                    profilePicture: profile.photos?.[0]?.value
                });
            } else {
                // Update existing user's GitHub ID if not set
                if (!user.githubId) {
                    user.githubId = profile.id;
                    await user.save();
                }
            }

            return done(null, user);
        } catch (error) {
            console.error('GitHub Auth Error:', error);
            return done(error, null);
        }
    }
}

module.exports = new SocialAuthService(); 