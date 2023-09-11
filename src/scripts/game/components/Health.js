import BaseComponent from '../core/gameObject/BaseComponent';
import signals from 'signals';

export default class Health extends BaseComponent {
    constructor() {
        super();
        this.currentHealth = 100;
        this.maxHealth = 100;

        this.healthUpdated = new signals.Signal();
        this.gotHealed = new signals.Signal();
        this.gotDamaged = new signals.Signal();
        this.gotKilled = new signals.Signal();
        this.gotKilledParticles = new signals.Signal();
    }
    get canHeal() { return this.currentHealth < this.maxHealth }
    get isDead() { return this.currentHealth <= 0 }
    get normal() { return Math.max(0, this.currentHealth / this.maxHealth) }
    set health(value) {
        this.currentHealth = value;
        this.healthUpdated.dispatch(this, value);
    }
    reset() {
        this.currentHealth = this.maxHealth;
    }
    setNewHealth(value) {
        this.maxHealth = value;
        this.currentHealth = this.maxHealth;

    }
    updateMaxHealth(value) {
        this.maxHealth = value;
    }
    heal(value){
        if (this.currentHealth >= this.maxHealth) {
            return true;
        }

        this.currentHealth += value;
        this.currentHealth = Math.min(this.maxHealth, this.currentHealth);
        this.gotHealed.dispatch(this, value);
        this.healthUpdated.dispatch(this, value);

        return this.currentHealth;
    }
    damage(value) {        
        if (this.currentHealth <= 0) {
            return true;
        }

        if (value > 0) {
            this.gotDamaged.dispatch(this, value);
        }

        
        this.currentHealth -= value;
        if (this.currentHealth <= 0) {
            if (this.gameObject.isPlayer) {
                console.log('KILL PLAYER')
            }
            this.gotKilled.dispatch(this);
            this.gotKilledParticles.dispatch(this);
        }
        
        this.healthUpdated.dispatch(this, value);
        return this.currentHealth <= 0;
    }
}