// @ts-check
import {test, expect} from "@playwright/test"
import {LoginPage} from "../pages/LoginPage"
import {Editor} from "../pages/Editor"
import {Dashboard} from "../pages/Dashboard"
import {MainPage} from "../pages/MainPage"
import creds from '../auth/creds.json'

test('ПРОД - Создание сессии для lixexog926*', async ({page}) => {
  // Переход на страницу авторизации
  const loginPage = new LoginPage(page)
  await loginPage.login(creds.email1, creds.password1)
  // Сохранение состояния в файл
  await page.context().storageState({ path: 'auth/auth1.json' });  
})

test('ПРОД - Создание сессии для xedibe9662*', async ({page}) => {
  // Переход на страницу авторизации
  const loginPage = new LoginPage(page)
  await loginPage.login(creds.email3, creds.password3)
  // Сохранение состояния в файл
  await page.context().storageState({ path: 'auth/auth3.json' });  
})

test('ПРОД - Создание сессии для brekinbeetle*', async ({page}) => {
  // Переход на страницу авторизации
  const loginPage = new LoginPage(page)
  await loginPage.login(creds.email2, creds.password2)
  // Сохранение состояния в файл
  await page.context().storageState({ path: 'auth/auth2.json' });  
})