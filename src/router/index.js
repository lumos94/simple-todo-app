import {createRouter, createWebHistory} from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
    history: createWebHistory('/'),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/:pathMatch(.*)*', // Catch-all route for non-existent paths
            redirect: '/', // Redirect to home
        },
    ],
});

export default router;
