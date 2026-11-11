// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // الدومين لسه مش متقرر — ده اللي الموقع بيستخدمه في الإيميل.
  // اللينكات المطلقة (canonical وOG والـsitemap) كلها بتتبني منه.
  site: 'https://planetmotion.studio',
});
