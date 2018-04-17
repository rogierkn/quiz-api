export default {
    general: {
        quizzes: '/quizzes',
        dashboard: '/',
        authenticate: '/authenticate'
    },
    quiz: {
        sessionList: '/quizzes/:id/sessions',
        edit: '/quizzes/:id/edit',
    },
    session: {
        listForQuiz: '/quizzes/:id/sessions',
        host: '/sessions/:id/host',
        share: '/sessions/:id/share',
        join: '/join/:id',
        play: {
            group: '/play/g/:id',
            individual: '/play/i/:id'
        },
        results: '/sessions/:id/results',
    },
    admin: {
        quizzes: '/admin/quizzes',
        users: '/admin/users',
    }
}