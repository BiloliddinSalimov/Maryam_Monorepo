import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      nav: {
        shop: "Shop",
        collections: "Collections",
        about: "About",
        contact: "Contact",
      },
      hero: {
        title: "NEW COLLECTION",
        subtitle: "Spring / Summer 2026",
        cta: "Explore Now",
      },
      categories: {
        clothing: "Clothing",
        bags: "Bags",
        shoes: "Modest Wear",
        jewelry: "Jewelry",
        outerwear: "Outerwear",
      },
      cart: {
        title: "Your Bag",
        empty: "Your bag is empty",
        checkout: "Checkout",
      },
    },
  },
  uz: {
    translation: {
      nav: {
        shop: "Do'kon",
        collections: "Kolleksiyalar",
        about: "Biz haqimizda",
        contact: "Aloqa",
      },
      hero: {
        title: "YANGI KOLLEKSIYA",
        subtitle: "Bahor / Yoz 2026",
        cta: "Hoziroq ko'ring",
      },
      categories: {
        clothing: "Kiyimlar",
        bags: "Sumkalar",
        shoes: "Hijobli ayollar uchun",
        jewelry: "Zargarlik",
        outerwear: "Ustki kiyimlar",
      },
      cart: {
        title: "Savat",
        empty: "Savatingiz bo'sh",
        checkout: "To'lovga o'tish",
      },
    },
  },
  ru: {
    translation: {
      nav: {
        shop: "Магазин",
        collections: "Коллекции",
        about: "О нас",
        contact: "Контакты",
      },
      hero: {
        title: "НОВАЯ КОЛЛЕКЦИЯ",
        subtitle: "Весна / Лето 2026",
        cta: "Смотреть сейчас",
      },
      categories: {
        clothing: "Одежда",
        bags: "Сумки",
        shoes: "Для женщин в хиджабе",
        jewelry: "Ювелирные украшения",
        outerwear: "Верхняя одежда",
      },
      cart: {
        title: "Корзина",
        empty: "Ваша корзина пуста",
        checkout: "Оформить заказ",
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
