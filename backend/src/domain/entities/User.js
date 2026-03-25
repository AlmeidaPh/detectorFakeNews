/**
 * Entidade de Domínio: User
 * Regras puras de negócio para usuários.
 */
export class User {
    constructor({ id, name, email, password, role, createdAt }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password; // Senha criptografada (infra)
        this.role = role || 'user';
        this.createdAt = createdAt || new Date();
    }

    static create(data) {
        if (!data.email || !data.email.includes('@')) {
            throw new Error('E-mail inválido');
        }
        if (!data.name || data.name.length < 3) {
            throw new Error('Nome deve ter pelo menos 3 caracteres');
        }
        return new User(data);
    }
}
