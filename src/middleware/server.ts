import express from 'express';
import { mount, queryParser, Router } from 'js-data-express';
import { Container } from 'js-data';

const app = express();
const store = new Container();
const userService = store.defineMapper('user');

// Variant 1
// Add a middleware method for the entire store
const config = {
    request: (req, res, next) => {
        const userLoggedIn = req.session.loggedIn;

        if (userLoggedIn) {
            next();
        } else {
            res.sendStatus(403);
        }
    },
    'destroy': {
        request: (req, res, next) => {
            const userIsAdmin = req.session.isAdmin;

            if (userIsAdmin) {
                next();
            } else {
                res.sendStatus(401);
            }
        }
    }
};

mount('/api', store, config);
