/// <reference types="Cypress" />

const { expect } = require("chai");
const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true, verbose: true });
const { faker } = require('@faker-js/faker');

describe('Busca de usuários', () => {

    it('Usuarios - Buscar todos usuários', () => {
        cy.getTodosUsuarios()
        .then(response => {
            expect(response.status).to.be.equal(200);
            
            cy.fixture('userSchema').then((userSchema) => {
                const validate = ajv.compile(userSchema)
                const valid = validate(response.body);
                if (!valid) {
                    expect.fail(validate.errors);
                };
            });
        
        });

    });

    it('Usuários - Buscar usuário passando ID válido', () => {

        cy.getTodosUsuarios()
            .then(response => {
                expect(response.status).to.be.equal(200);
                
                let userId = response.body.usuarios[0]._id;
                cy.getUsuarios('_id=' + userId)
                    .then(response => {
                        expect(response.status).to.be.equal(200);

                        cy.fixture('userSchema').then((userSchema) => {
                            const validate = ajv.compile(userSchema)
                            const valid = validate(response.body);
                            if (!valid) {
                                expect.fail(validate.errors);
                            };
                        });
                    });
            });
    });

    it('Usuários - Buscar usuário passando ID inválido', () => {
        cy.getUsuarios('_id=invalido')
            .then(response => {
                expect(response.status).to.be.equal(200);
                expect(response.body.quantidade, 'Deve retornar 0 no quantidade de usuários').to.be.equal(0);
                expect(response.body.usuarios).to.be.an('array').and.be.empty;

                cy.fixture('userSchema').then((userSchema) => {
                    const validate = ajv.compile(userSchema)
                    const valid = validate(response.body);
                    if (!valid) {
                        expect.fail(validate.errors);
                    };
                });
            });
    });

    it('Usuários - Buscar usuário passando um parametro inexistente.', () => {
        cy.getUsuarios('noexiste=test')
            .then(response => {
                expect(response.status).to.be.equal(400);
                expect(response.body).to.eql({ noexiste: 'noexiste não é permitido' });
            });
    }); 
});

describe('Cadastro de usuários', () => {

    it('Usuários - Cadastrar um usuário com dados válidos', () => {
        
        const userObject = {
            'nome': faker.name.firstName(),
            'email': faker.internet.email(),
            'password': faker.internet.password(20),
            'administrador': 'true'
        }
        
        cy.postUser(userObject)
        .then(response => {
            expect(response.status).to.be.equal(201);
            expect(response.body.message).to.be.equal('Cadastro realizado com sucesso');
            expect(response.body._id).to.be.an('string');
        });
    });


    it('Usuários - Cadastrar um usuário sem informar o parâmetro nome', () => {

        const userObject = {
            'email': faker.internet.email(),
            'password': faker.internet.password(20),
            'administrador': 'true'
        }

        cy.postUser(userObject)
            .then(response => {
                expect(response.status).to.be.equal(400);
                expect(response.body).to.be.eql({ nome: 'nome é obrigatório' });
            });
    });

    it('Usuários - Cadastrar um usuário informando o parametro nome em branco', () => {

        const userObject = {
            'nome': '',
            'email': faker.internet.email(),
            'password': faker.internet.password(20),
            'administrador': 'true'
        }

        cy.postUser(userObject)
            .then(response => {
                expect(response.status).to.be.equal(400);
                expect(response.body).to.be.eql({ nome: 'nome não pode ficar em branco' });
            });
    });

    it('Usuários - Cadastrar um usuário sem informar o parâmetro email', () => {

        const userObject = {
            'nome': faker.name.firstName(),
            'password': faker.internet.password(20),
            'administrador': 'true'
        }

        cy.postUser(userObject)
            .then(response => {
                expect(response.status).to.be.equal(400);
                expect(response.body).to.be.eql({ email: 'email é obrigatório' });
            });
    });

    it('Usuários - Cadastrar um usuário informando o parametro email em branco', () => {

        const userObject = {
            'nome': faker.name.firstName(),
            'email': '',
            'password': faker.internet.password(20),
            'administrador': 'true'
        }

        cy.postUser(userObject)
            .then(response => {
                expect(response.status).to.be.equal(400);
                expect(response.body).to.be.eql({ email: 'email não pode ficar em branco' });
            });
    });


    it('Usuários - Cadastrar um usuário informando o parametro email inválido', () => {

        const userObject = {
            'nome': faker.name.firstName(),
            'email': 'emailinvalido',
            'password': faker.internet.password(20),
            'administrador': 'true'
        }

        cy.postUser(userObject)
            .then(response => {
                expect(response.status).to.be.equal(400);
                expect(response.body).to.be.eql({ email: 'email deve ser um email válido' });
            });
    });

    it('Usuários - Cadastrar um usuário sem informar o parâmetro password', () => {

        const userObject = {
            'nome': faker.name.firstName(),
            'email': faker.internet.email(),
            'administrador': 'true'
        }

        cy.postUser(userObject)
            .then(response => {
                expect(response.status).to.be.equal(400);
                expect(response.body).to.be.eql({ password: 'password é obrigatório' });
            });
    });

    it('Usuários - Cadastrar um usuário informando o parametro password em branco', () => {

        const userObject = {
            'nome': faker.name.firstName(),
            'email': faker.internet.email(),
            'password': '',
            'administrador': 'true'
        }

        cy.postUser(userObject)
            .then(response => {
                expect(response.status).to.be.equal(400);
                expect(response.body).to.be.eql({ password: 'password não pode ficar em branco' });
            });
    });

    it('Usuários - Cadastrar um usuário sem informar o parâmetro administrador', () => {

        const userObject = {
            'nome': faker.name.firstName(),
            'email': faker.internet.email(),
            'password': faker.internet.password(20),
        }

        cy.postUser(userObject)
            .then(response => {
                expect(response.status).to.be.equal(400);
                expect(response.body).to.be.eql({ administrador: 'administrador é obrigatório' });
            });
    });

    it('Usuários - Cadastrar um usuário informando o parametro administrador em branco', () => {

        const userObject = {
            'nome': faker.name.firstName(),
            'email': faker.internet.email(),
            'password': faker.internet.password(20),
            'administrador': ''
        }

        cy.postUser(userObject)
            .then(response => {
                expect(response.status).to.be.equal(400);
                expect(response.body).to.be.eql({ administrador: 'administrador deve ser \'true\' ou \'false\'' });
            });
    });

    it('Usuários - Cadastrar um usuário informando o parametro administrador inválido', () => {

        const userObject = {
            'nome': faker.name.firstName(),
            'email': faker.internet.email(),
            'password': faker.internet.password(20),
            'administrador': 'qualquercoisa'
        }

        cy.postUser(userObject)
            .then(response => {
                expect(response.status).to.be.equal(400);
                expect(response.body).to.be.eql({ administrador: 'administrador deve ser \'true\' ou \'false\'' });
            });
    });

    it('Usuários - Cadastrar um usuário já existente', () => {

        const userObject = {
            'nome': faker.name.firstName(),
            'email': faker.internet.email(),
            'password': faker.internet.password(20),
            'administrador': 'true'
        }

        cy.postUser(userObject)
            .then(response => {
                expect(response.status).to.be.equal(201);
                expect(response.body.message).to.be.equal('Cadastro realizado com sucesso');
                expect(response.body._id).to.be.an('string');

                cy.postUser(userObject)
                    .then(response => {
                        expect(response.status).to.be.equal(400);
                        expect(response.body).to.be.eql({ message: 'Este email já está sendo usado' });
                    });
            });
    });
});