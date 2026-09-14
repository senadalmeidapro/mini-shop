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
  toast.success('Message envoyé ! Nous vous répondrons sous 24\u00a0h.');
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
      <h1 class="contact-hero__title">Nous <span class="contact-hero__accent">contacter</span></h1>
      <p class="contact-hero__subtitle">
        Une question, une suggestion ou un probl\u00e8me\u00a0? Notre équipe vous répond dans les
        meilleurs délais.
      </p>
    </section>

    <!-- ── Contenu ───────────────────────────────────────── -->
    <section class="contact-body">
      <!-- Infos -->
      <aside class="contact-info">
        <h2>Coordonnées</h2>

        <div class="contact-info__item">
          <span class="contact-info__label">Adresse</span>
          <p>42 Rue de la Paix, 75002 Paris, France</p>
        </div>

        <div class="contact-info__item">
          <span class="contact-info__label">Email</span>
          <p><a href="mailto:support@minishop.com">support@minishop.com</a></p>
        </div>

        <div class="contact-info__item">
          <span class="contact-info__label">Téléphone</span>
          <p><a href="tel:+33180000000">+33\u00a01\u00a080\u00a000\u00a000\u00a000</a></p>
        </div>

        <div class="contact-info__item">
          <span class="contact-info__label">Horaires</span>
          <p>Lun - Ven, 9h - 18h</p>
        </div>
      </aside>

      <!-- Formulaire -->
      <form class="contact-form" @submit.prevent="handleSubmit">
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
            placeholder="Ex: Question sur une commande"
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

        <button type="submit" class="contact-form__submit">Envoyer le message</button>
      </form>
    </section>
  </div>
</template>

<style scoped>
/* ── Hero ──────────────────────────────────────────── */
.contact-hero {
  text-align: center;
  padding: 4rem 1rem 2.5rem;
}

.contact-hero__title {
  font-size: clamp(2rem, 4.5vw, 3rem);
  line-height: 1.15;
  color: var(--color-heading);
  margin-bottom: 0.75rem;
}

.contact-hero__accent {
  color: var(--color-primary);
}

.contact-hero__subtitle {
  max-width: 520px;
  margin: 0 auto;
  font-size: 1.1rem;
  color: var(--color-text-soft);
  line-height: 1.65;
}

/* ── Body ──────────────────────────────────────────── */
.contact-body {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

@media (max-width: 720px) {
  .contact-body {
    grid-template-columns: 1fr;
  }
}

/* ── Infos ─────────────────────────────────────────── */
.contact-info h2 {
  font-size: 1.25rem;
  color: var(--color-heading);
  margin-bottom: 1.25rem;
}

.contact-info__item {
  margin-bottom: 1.25rem;
}

.contact-info__label {
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-soft);
  margin-bottom: 0.15rem;
}

.contact-info__item p {
  font-size: 0.95rem;
  color: var(--color-text);
}

.contact-info__item a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.contact-info__item a:hover {
  text-decoration: underline;
}

/* ── Form ──────────────────────────────────────────── */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  gap: 0.3rem;
}

.contact-form__field label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-heading);
}

.contact-form__field input,
.contact-form__field textarea {
  width: 100%;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-text);
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.contact-form__field input:focus,
.contact-form__field textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-focus);
}

.contact-form__field textarea {
  resize: vertical;
  min-height: 120px;
}

.contact-form__submit {
  align-self: flex-start;
  padding: 0.7rem 1.75rem;
  border: none;
  border-radius: var(--radius-pill);
  background-color: var(--color-primary);
  color: var(--color-primary-contrast);
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.contact-form__submit:hover {
  background-color: var(--color-primary-hover);
}
</style>
