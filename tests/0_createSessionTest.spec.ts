// @ts-check
import {test, expect} from "@playwright/test"
import {LoginPage} from "../pages/LoginPage"
import {Editor} from "../pages/Editor"
import {Dashboard} from "../pages/Dashboard"
import {MainPage} from "../pages/MainPage"
import creds from '../auth/creds.json'

test('ТЕСТ - Создание сессии для mipipon*', async ({page}) => {
  // Переход на страницу авторизации
  const loginPage = new LoginPage(page)
  await loginPage.loginTest(creds.emailTestFree, creds.passwordTestFree)
  // Сохранение состояния в файл
  await page.context().storageState({ path: 'auth/authTestFree.json' });  
})

test('ТЕСТ - Создание сессии для kaw-liga*', async ({page}) => {
  // Переход на страницу авторизации
  const loginPage = new LoginPage(page)
  await loginPage.loginTest(creds.emailTest, creds.passwordTest)
  // Сохранение состояния в файл
  await page.context().storageState({ path: 'auth/authTest.json' });  
})