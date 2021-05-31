const http = require('http');
const url = require('url')
const fetch = require('node-fetch')
const hostname ='localhost'

const server = http.createServer((req, res) => {
    const method = req.method
    const current_url = new URL(req.url, 'https://git-repo-server.herokuapp.com');
    const pathname = current_url.pathname
    const search_params = current_url.searchParams
    let username = search_params.get('username')

    if(method === 'GET' && pathname === '/repos' && search_params.has('username')) {
        const githubURL = 'https://api.github.com/graphql'

        res.setHeader('Access-Control-Allow-Origin', '*')
        
        console.log(req.headers)

        const query =`
            query {
                repositoryOwner(login: "${username}") {
                ... on User {
                        avatarUrl(size: 300)
                        bio
                        email
                        login
                        name
                        followers {
                            totalCount
                        }
                        following {
                            totalCount
                        }
                        starredRepositories {
                            totalCount
                        }
                        status {
                            emojiHTML
                            message
                        }
                        twitterUsername
                        websiteUrl
                        repositories(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {
                            nodes {
                                name
                                description
                                languages(first: 4, orderBy: {field: SIZE, direction: DESC}) {
                                    nodes {
                                        color
                                        name
                                    }
                                }
                                stargazerCount
                                updatedAt
                                forkCount
                                licenseInfo {
                                    name
                                }
                            }
                        }
                    }
                }
            }
        ` 

       fetch(githubURL, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({query})
            }).then((result) => result.json())
                .then((body) => {
                    res.writeHead(200, {'Content-Type': 'application/json'})
                    res.end(JSON.stringify(body, null, 3))
                })
                .catch((err) => console.error(err)) 
    }
});

server.listen(3000, hostname, ()=> {
    console.log('server started at localhost:3000')
})