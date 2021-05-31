const http = require('http');
const url = require('url')
const fetch = require('node-fetch')
const hostname ='localhost'

const server = http.createServer((req, res) => {
    const method = req.method
    const current_url = new URL(req.url, 'http://localhost:3000');
    const pathname = current_url.pathname
    const search_params = current_url.searchParams
    let username = search_params.get('username')

    if(method === 'GET' && pathname === '/repos' && search_params.has('username')) {
        /* let username = search_params.get('username') */
        const githubURL = 'https://api.github.com/graphql'
        const token = "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"
        let response = ''

        /* res.writeHead(200, {'Access-Control-Allow-Origin': 'http://127.0.0.1:5500/', 'Content-Type': 'application/json'}); */

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
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({query})
            }).then((result) => result.json())
                .then((body) => {
                    /* response += body */
                    /* console.log(JSON.stringify(body)) */
                    res.writeHead(200, {'Content-Type': 'application/json'})
                    res.end(JSON.stringify(body, null, 3))
                })
                .catch((err) => console.error(err))
            
            /* res.write(JSON.stringify(body, null, 3)) */

            
    }
    /* else if(method === "POST" && pathname === '/profile') {
        let data = ''
    
        res.writeHead(200, {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'});
    
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', ()=> {
            console.log(JSON.parse(data))
            let current_url = new URL(JSON.parse(data))
            
            username += current_url.searchParams.get('username')
            console.log(username)
        }) 
           
        
    }*/

    /* let data = '';
    
        
        
        try {
            
        } catch (error) {
            console.error(error);
        }
    })
    res.write(JSON.stringify(response, null, 2)) */
});

server.listen(3000, hostname, ()=> {
    console.log('server started at localhost:3000')
})
/* 
avatarUrl(size: 300)
            login
            ... on User {
                id
                email
                name
                status {
                    emojiHTML
                }
                twitterUsername
                starredRepositories {
                    totalCount
                }
                followers {
                    totalCount
                }
                following {
                    totalCount
                }
            }
            repositories(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {
              edges {
                    node {
                        name,
                        description,
                        url,
                        updatedAt,
                        isFork,
                        forkCount,
                        stargazerCount,
                        licenseInfo {
                            name
                        },
                        languages(first: 1, orderBy: {field: SIZE, direction: DESC}){
                            nodes {
                                color,
                                name
                            }
                        }
                    }
                }
            }
          }  */