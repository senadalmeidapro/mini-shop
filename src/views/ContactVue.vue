<script setup lang="ts">
import { reactive } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
});

function handleSubmit() {
  toast.success('Message envoyé ! Nous vous répondrons sous 24h.');
  form.name = '';
  form.email = '';
  form.subject = '';
  form.message = '';
}
</script>

<template>
  <div class="contact">
    <!-- ── Hero ──────────────────────────────────────────── -->
    <section class="contact-hero">
      <div class="contact-hero__glow" aria-hidden="true"></div>
      <h1 class="contact-hero__title reveal">
        Nous <span class="grad-text">contacter</span>
      </h1>
      <p class="contact-hero__subtitle reveal reveal--d1">
        Une question, une suggestion ou un problème ? Notre équipe vous répond dans les meilleurs
        délais.
      </p>
    </section>

    <!-- ── Contenu ───────────────────────────────────────── -->
    <section class="contact-body">
      <!-- Infos -->
      <aside class="contact-info reveal">
        <h2>Coordonnées</h2>

        <div class="contact-info__item">
          <span class="contact-info__icon" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M10 18s-6-4.7-6-9a6 6 0 1112 0c0 4.3-6 9-6 9z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <circle cx="10" cy="9" r="2.2" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </span>
          <div class="contact-info__text">
            <span class="contact-info__label">Adresse</span>
            <p>42 Rue de la Paix, 75002 Paris, France</p>
          </div>
        </div>

        <div class="contact-info__item">
          <span class="contact-info__icon" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none">
              <rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M3 6l7 5 7-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <div class="contact-info__text">
            <span class="contact-info__label">Email</span>
            <p><a href="mailto:support@minishop.com">support@minishop.com</a></p>
          </div>
        </div>

        <div class="contact-info__item">
          <span class="contact-info__icon" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M4 3h3l1.5 4L6.5 8.5a10 10 0 005 5L13 12l4 1.5v3a1.5 1.5 0 01-1.6 1.5A14 14 0 012.5 4.6 1.5 1.5 0 014 3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <div class="contact-info__text">
            <span class="contact-info__label">Téléphone</span>
            <p><a href="tel:+33180000000">+33 1 80 00 00 00</a></p>
          </div>
        </div>

        <div class="contact-info__item">
          <span class="contact-info__icon" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5"/>
              <path d="M10 5.5V10l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
          <div class="contact-info__text">
            <span class="contact-info__label">Horaires</span>
            <p>Lun - Ven, 9h - 18h</p>
          </div>
        </div>
      </aside>

      <!-- Formulaire -->
      <form class="contact-form reveal reveal--d1" @submit.prevent="handleSubmit">
        <div class="contact-form__row">
          <div class="contact-form__field">
            <label for="name">Nom</label>
            <input id="name" v-model="form.name" type="text" placeholder="Jean Dupont" required />
          </div>
          <div class="contact-form__field">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="jean@exemple.com"
              required
            />
          </div>
        </div>

        <div class="contact-form__field">
          <label for="subject">Sujet</label>
          <input
            id="subject"
            v-model="form.subject"
            type="text"
            placeholder="Ex : Question sur une commande"
            required
          />
        </div>

        <div class="contact-form__field">
          <label for="message">Message</label>
          <textarea
            id="message"
            v-model="form.message"
            rows="6"
            placeholder="Décrivez votre demande..."
            required
          />
        </div>

        <button type="submit" class="contact-form__submit">
          Envoyer le message
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 10l13-5-3 12-3-5-5-2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M10 12l6-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </form>
    </section>
  </div>
</template>

<style scoped>
/* ── Hero ──────────────────────────────────────────────── */
.contact-hero {
  position: relative;
  text-align: center;
  padding: 5rem 1rem 3.5rem;
  overflow: hidden;
}

.contact-hero__glow {
  position: absolute;
  top: -45%;
  left: 50%;
  transform: translateX(-50%);
  width: 520px;
  height: 520px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%);
  opacity: 0.35;
  pointer-events: none;
  animation: float-y 7s var(--ease-smooth) infinite;
}

.contact-hero__title {
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  font-weight: 800;
  line-height: 1.15;
  color: var(--color-heading);
  margin-bottom: 0.75rem;
}

.contact-hero__subtitle {
  max-width: 540px;
  margin: 0 auto;
  font-size: 1.12rem;
  color: var(--color-text-soft);
  line-height: 1.7;
}

/* ── Body ──────────────────────────────────────────────── */
.contact-body {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2.5rem;
  padding-top: 2rem;
}

@media (max-width: 800px) {
  .contact-body {
    grid-template-columns: 1fr;
  }
}

/* ── Infos ─────────────────────────────────────────────── */
.contact-info h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
}

.contact-info__item {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  margin-bottom: 1.1rem;
  padding: 0.9rem 1rem;
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  transition:
    background var(--duration),
    border-color var(--duration),
    transform var(--duration) var(--ease-out);
}

.contact-info__item:hover {
  background: var(--color-background-soft);
  border-color: var(--color-border);
  transform: translateX(4px);
}

.contact-info__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-pill);
  background: var(--color-primary-soft);
  color: var(--color-primary);
  transition: background var(--duration);
}

.contact-info__item:hover .contact-info__icon {
  background: var(--color-primary);
  color: var(--color-primary-contrast);
}

.contact-info__icon svg {
  width: 18px;
  height: 18px;
}

.contact-info__text {
  min-width: 0;
}

.contact-info__label {
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-soft);
  margin-bottom: 0.1rem;
}

.contact-info__item p {
  font-size: 0.95rem;
  color: var(--color-text);
  line-height: 1.5;
}

.contact-info__item a {
  position: relative;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
}

.contact-info__item a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-primary);
  border-radius: var(--radius-pill);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform var(--duration) var(--ease-out);
}

.contact-info__item a:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* ── Form ──────────────────────────────────────────────── */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  padding: 2rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

@media (max-width: 800px) {
  .contact-form {
    padding: 1.5rem;
  }
}

.contact-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 520px) {
  .contact-form__row {
    grid-template-columns: 1fr;
  }
}

.contact-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.contact-form__field label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-heading);
}

.contact-form__field input,
.contact-form__field textarea {
  width: 100%;
  padding: 0.75rem 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-text);
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  transition:
    border-color var(--duration),
    box-shadow var(--duration);
}

.contact-form__field input::placeholder,
.contact-form__field textarea::placeholder {
  color: var(--color-text-soft);
  opacity: 0.7;
}

.contact-form__field input:hover,
.contact-form__field textarea:hover {
  border-color: var(--color-border-hover);
}

.contact-form__field input:focus,
.contact-form__field textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 var(--ring-width) var(--color-focus);
}

.contact-form__field textarea {
  resize: vertical;
  min-height: 120px;
}

.contact-form__submit {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.9rem;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--gradient-brand);
  color: var(--color-primary-contrast);
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition:
    transform var(--duration) var(--ease-out),
    box-shadow var(--duration);
}

.contact-form__submit svg {
  width: 18px;
  height: 18px;
  transition: transform var(--duration) var(--ease-out);
}

.contact-form__submit:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-glow);
}

.contact-form__submit:hover svg {
  transform: translate(2px, -2px);
}
</style>