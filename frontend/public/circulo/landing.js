/**
 * Interacciones, analítica GA4/GTM y formulario de reserva anticipada para /circulo/.
 * Archivo externo compatible con Content-Security-Policy (script-src 'self') de personal_web.
 */
(function () {
  'use strict';

  var GTM_ID = 'GTM-TP42PVRG';
  var FALLBACK_EMAIL = 'jimdav1506ceva@gmail.com';
  var WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var PLAN_LABELS = {
    'pro-early': 'Reserva Círculo Pro · $9 USD (acceso anticipado)',
    'audit-service': 'Auditoría Express / Plan Agencias (desde $25 USD)',
    'macos-updates': 'Aviso de versión macOS y paquetes por uso',
  };

  /** Inicializa GTM respetando la elección de consentimiento del portafolio principal. */
  function initAnalytics() {
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
    }

    var consent = 'denied';
    try {
      if (window.localStorage.getItem('cookie-consent') === 'granted') {
        consent = 'granted';
      }
    } catch (_) {
      consent = 'denied';
    }

    window.gtag('consent', 'default', {
      analytics_storage: consent,
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });

    var host = window.location.hostname;
    if (host === 'davidcevallos.me' || host === 'www.davidcevallos.me') {
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
      document.head.appendChild(script);
    }
  }

  /** Envía un evento estructurado a GA4/GTM sin bloquear la navegación. */
  function trackEvent(eventName, params) {
    if (!eventName) return;
    var payload = Object.assign({ page_slug: 'circulo' }, params || {});
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, payload);
      }
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push(Object.assign({ event: eventName }, payload));
      }
    } catch (_) {
      // Nunca interrumpir la interacción del usuario si un bloqueador impide analítica.
    }
  }

  /** Registra clics de intención en botones CTA y preselecciona el plan en el formulario. */
  function bindTrackers() {
    var tracked = document.querySelectorAll('[data-track]');
    tracked.forEach(function (el) {
      el.addEventListener('click', function () {
        var eventName = el.getAttribute('data-track');
        var location = el.getAttribute('data-location') || 'page';
        var plan = el.getAttribute('data-select-plan');
        trackEvent(eventName, { location: location, plan: plan || 'none' });

        if (plan) {
          var planSelect = document.getElementById('plan');
          if (planSelect) {
            planSelect.value = plan;
          }
          var nameInput = document.getElementById('name');
          if (nameInput) {
            window.setTimeout(function () {
              nameInput.focus({ preventScroll: true });
            }, 350);
          }
        }
      });
    });
  }

  function setFieldError(fieldName, message) {
    var slot = document.querySelector('[data-error-for="' + fieldName + '"]');
    if (slot) slot.textContent = message || '';
  }

  function setStatus(message, kind) {
    var statusEl = document.getElementById('form-status');
    if (!statusEl) return;
    statusEl.textContent = message || '';
    statusEl.className = 'form-status' + (kind ? ' ' + kind : '');
  }

  function bindReserveForm() {
    var form = document.getElementById('reserve-form');
    if (!form) return;

    var submitBtn = document.getElementById('reserve-submit');
    var accessKey = (form.getAttribute('data-web3forms-key') || '').trim();
    var checkoutUrl = (form.getAttribute('data-checkout-url') || '').trim();

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      setFieldError('name', '');
      setFieldError('email', '');
      setStatus('', '');

      var data = new FormData(form);
      if (data.get('botcheck')) return;

      var name = String(data.get('name') || '').trim();
      var email = String(data.get('email') || '').trim();
      var plan = String(data.get('plan') || 'pro-early').trim();
      var network = String(data.get('network') || 'Instagram').trim();
      var notes = String(data.get('notes') || '').trim();

      var hasError = false;
      if (name.length < 2) {
        setFieldError('name', 'Escribe tu nombre.');
        hasError = true;
      }
      if (!EMAIL_RE.test(email)) {
        setFieldError('email', 'Revisa que tu correo sea válido.');
        hasError = true;
      }
      if (hasError) return;

      var planLabel = PLAN_LABELS[plan] || plan;
      var formattedMessage = [
        'Interés: ' + planLabel,
        'Red principal: ' + network,
        'Notas: ' + (notes || 'Sin comentarios adicionales.'),
      ].join('\n');

      trackEvent('generate_lead', {
        plan_interest: plan,
        network: network,
        value: plan === 'pro-early' ? 9 : plan === 'audit-service' ? 25 : 0,
        currency: 'USD',
      });

      // Si no hay clave pública de Web3Forms configurada, abrimos correo real sin fingir envío.
      if (!accessKey) {
        var subject = encodeURIComponent('Círculo · ' + planLabel + ' · ' + name);
        var body = encodeURIComponent(formattedMessage + '\n\n' + name + ' <' + email + '>');
        setStatus(
          'Abriendo tu cliente de correo para completar tu solicitud. También puedes escribir directo a ' +
            FALLBACK_EMAIL +
            '.',
          'success'
        );
        window.location.assign('mailto:' + FALLBACK_EMAIL + '?subject=' + subject + '&body=' + body);
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando…';
      }

      fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          subject: 'Círculo · ' + planLabel + ' · ' + name,
          from_name: 'Círculo · DC.dev',
          name: name,
          email: email,
          message: formattedMessage,
        }),
      })
        .then(function (response) {
          return response.json().then(function (json) {
            return { ok: response.ok && Boolean(json && json.success), message: json && json.message };
          });
        })
        .then(function (result) {
          if (result.ok) {
            form.reset();
            setStatus(
              checkoutUrl && plan === 'pro-early'
                ? 'Reserva registrada. Redirigiendo a la página segura de pago anticipado…'
                : '¡Listo! Recibimos tu registro. Te escribiremos pronto con los siguientes pasos.',
              'success'
            );
            if (checkoutUrl && plan === 'pro-early' && /^https:\/\//i.test(checkoutUrl)) {
              window.setTimeout(function () {
                window.location.assign(checkoutUrl);
              }, 900);
            }
          } else {
            setStatus(result.message || 'No se pudo enviar. Intenta de nuevo o escríbenos al correo.', 'error');
          }
        })
        .catch(function () {
          setStatus('Sin conexión. Intenta nuevamente o escribe directo a ' + FALLBACK_EMAIL + '.', 'error');
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar solicitud';
          }
        });
    });
  }

  /** Botones "Copiar" (huella SHA-256 y comandos) en la página de descarga. */
  function bindCopyButtons() {
    document.querySelectorAll('[data-copy-target]').forEach(function (button) {
      button.addEventListener('click', function () {
        var target = document.getElementById(button.getAttribute('data-copy-target'));
        if (!target || !navigator.clipboard) return;
        var original = button.textContent;
        navigator.clipboard.writeText(target.textContent.trim()).then(function () {
          button.textContent = 'Copiado';
          window.setTimeout(function () {
            button.textContent = original;
          }, 1600);
        });
      });
    });
  }

  initAnalytics();
  bindCopyButtons();
  bindTrackers();
  bindReserveForm();
})();
