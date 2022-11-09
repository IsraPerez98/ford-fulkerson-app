const ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/IsraPerez98/app-titulos', // Update to point to your repository  
        user: {
            name: 'IsraPerez98', // update to use your name
            email: 'isra1998isra@gmail.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)