import { SwaggerOptions } from "swagger-ui-express";

export const OPTIONS: SwaggerOptions = {
    swagger: '2.0',
    info: {
        version: '1.0.0',
        title: 'Nodejs Rest Api With TypeScript for Authorization',
        description: 'It is only using for authorization',
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
        }
    },
    host: 'localhost:8080/',
    basePath: 'auth/',
    tags: [
        {
            name: 'auth',
            description: 'Auth process end points',
        },
    ],
    schemes: [
        'http'
    ],
    consumes: [
        'application/json'
    ],
    produces: [
        'application/json'
    ],
    definitions: {
        login: {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    example: 'john.doe@gmail.com',
                },
                password: {
                    type: 'string',
                    example: '123456',
                }
            }
        },
        register: {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    example: 'john.doe@gmail.com',
                },
                name: {
                    type: 'string',
                    example: 'John Doe',
                },
                password: {
                    type: 'string',
                    example: '123456',
                }
            }
        },
        forgotpassword: {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    example: 'john.doe@gmail.com',
                },
            }
        },
        resetpassword: {
            type: 'object',
            properties: {
                // resetPasswordKey: {
                //     type: 'string',
                //     example: 'aksdkajshdkshdkhaksdhaksdhkashdkashdkahskdjahqweqeqwqewq',
                // },
                password: {
                    type: 'string',
                    example: 'john.doe@gmail.com',
                }
            }
        }

    },
    paths: {
        '/login': {
            post: {
                tags: [
                    'auth'
                ],
                summary: 'The user can log in.',
                description: 'This end point return access and refresh token if the user email and password are valid.',
                parameters: [
                    {
                        name: 'body',
                        in: 'body',
                        description: 'User should send email and pasword as a json object format',
                        schema: {
                            $ref: '#/definitions/login'
                        },
                        required: true
                    },
                ],
                responses: {
                    200: {
                        description: 'OK'
                    },
                    400: {
                        description: 'Missing parameters',
                        content: {
                            'application/json': {
                                example: {
                                    message: 'email or password are invalid',
                                    internal_code: 'email_or_password_invalid'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/register': {
            post: {
                tags: [
                    'auth'
                ],
                summary: 'The user can create an account.',
                description: 'des',
                parameters: [
                    {
                        name: 'body',
                        in: 'body',
                        description: 'The Email of user',
                        schema: {
                            $ref: '#/definitions/register'
                        },
                        required: true
                    },
                ],
                responses: {
                    200: {
                        description: 'OK'
                    },
                    400: {
                        description: 'Missing parameters',
                        content: {
                            'application/json': {
                                example: {
                                    message: 'userId is missing',
                                    internal_code: 'missing_parameters'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/forgotpassword': {
            post: {
                tags: [
                    'auth'
                ],
                summary: 'The user can make request for refreshing password mail.',
                description: 'des',
                parameters: [
                    {
                        name: 'body',
                        in: 'body',
                        description: 'The Email of user',
                        schema: {
                            $ref: '#/definitions/forgotpassword'
                        },
                        required: true
                    },
                ],
                responses: {
                    200: {
                        description: 'OK'
                    },
                    400: {
                        description: 'Missing parameters',
                        content: {
                            'application/json': {
                                example: {
                                    message: 'userId is missing',
                                    internal_code: 'missing_parameters'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/resetpassword/{resetPasswordKey}': {
            post: {
                tags: [
                    'auth'
                ],
                summary: 'The user can set a new password',
                description: 'des',
                parameters: [
                    {
                        name: 'resetPasswordKey',
                        in: 'path',
                        description: 'The Key to find the user who wants to create a new password',
                        required: true,
                    },
                    {
                        name: 'password',
                        in: 'body',
                        description: 'The Key to find the user who wants to create a new password',
                        schema: {
                            $ref: '#/definitions/resetpassword'
                        },
                        required: true
                    },
                ],
                responses: {
                    200: {
                        description: 'OK'
                    },
                    400: {
                        description: 'Missing parameters',
                        content: {
                            'application/json': {
                                example: {
                                    message: 'userId is missing',
                                    internal_code: 'missing_parameters'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/logout': {
            post: {
                tags: [
                    'auth'
                ],
                summary: 'The user can log out.',
                description: 'This end point return success status as boolean and result object that has a message.',
                responses: {
                    200: {
                        description: 'OK'
                    },
                }
            }
        },
    }
};
