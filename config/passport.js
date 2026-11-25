import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";

// Configure GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        // Get GitHub ID
        const githubId = profile.id;

        // Get email from GitHub profile
        const email = profile.emails?.[0]?.value?.toLowerCase();

        // Get user's name
        const name = profile.displayName || profile.username;

        // Check if email exists
        if (!email) {
          return done(
            new Error("GitHub account must have an accessible email.")
          );
        }

        // Check if GitHub user already exists
        let user = await User.findOne({ githubId });

        if (user) {
          return done(null, user);
        }

        // Check if email already exists
        user = await User.findOne({ email });

        if (user) {
          // Link GitHub account to existing user
          user.githubId = githubId;
          await user.save();

          return done(null, user);
        }

        // Create new GitHub user
        user = await User.create({
          name,
          email,
          githubId,
        });

        return done(null, user);

      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;