// ========= EDIT YOUR DETAILS HERE =========
const CONFIG = {
  whatsappNumber: "YOUR_WHATSAPP_NUMBER", // country code + number, no + or spaces. Example: 919876543210
  email: "YOUR_EMAIL@example.com",        // your real email
  formEndpoint: ""                        // optional: Formspree URL like https://formspree.io/f/xxxx
};
// ==========================================

const $ = (id) => document.getElementById(id);
const whatsappReady = /^\d{10,15}$/.test(CONFIG.whatsappNumber);
const emailReady = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONFIG.email) && !CONFIG.email.startsWith("YOUR_");

// Toast message
let toastTimer;
function showToast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
}

// Mobile menu
const menuBtn = $("menuBtn"), navLinks = $("navLinks");
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.textContent = open ? "✕" : "☰";
});
navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.textContent = "☰";
}));

// Navbar background on scroll
const navbar = $("navbar");
const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 30);
window.addEventListener("scroll", onScroll); onScroll();

// Scroll reveal animation
const items = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  items.forEach((el) => io.observe(el));
} else { items.forEach((el) => el.classList.add("visible")); }

// Placeholder project buttons (links not added yet)
document.querySelectorAll(".is-placeholder").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    showToast(btn.dataset.note || "Link coming soon");
  });
});

// WhatsApp + Email buttons
const msg = encodeURIComponent("Hi Sachin, I saw your portfolio and I'm interested in a website for my business.");
const wa = $("whatsappBtn"), em = $("emailBtn");
wa.href = whatsappReady ? `https://wa.me/${CONFIG.whatsappNumber}?text=${msg}` : "#";
em.href = emailReady ? `mailto:${CONFIG.email}` : "#";
wa.addEventListener("click", (e) => { if (!whatsappReady) { e.preventDefault(); showToast("Add your WhatsApp number in script.js first"); } });
em.addEventListener("click", (e) => { if (!emailReady) { e.preventDefault(); showToast("Add your email in script.js first"); } });
$("contactNote").textContent = CONFIG.formEndpoint ? "" : "Tip: the form opens your email app with your message ready to send.";

// Contact form (honest behaviour: real service OR opens email app)
$("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const status = $("formStatus");
  const name = $("name").value.trim(), email = $("email").value.trim(), message = $("message").value.trim();
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
    status.textContent = "Please fill in all fields with a valid email.";
    return;
  }
  if (CONFIG.formEndpoint) {
    try {
      status.textContent = "Sending...";
      const res = await fetch(CONFIG.formEndpoint, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message })
      });
      if (!res.ok) throw new Error();
      status.textContent = "Thank you! Your message was sent.";
      e.target.reset();
    } catch { status.textContent = "Could not send. Please use WhatsApp or email instead."; }
  } else if (emailReady) {
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Website enquiry from " + name)}&body=${body}`;
    status.textContent = "Opening your email app. Please press Send there to deliver the message.";
  } else {
    status.textContent = "Form is not connected yet. Please add your email in script.js.";
  }
});

// Footer year
$("year").textContent = new Date().getFullYear();
