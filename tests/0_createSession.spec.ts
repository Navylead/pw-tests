// @ts-check
import {test, expect} from "@playwright/test"
import {LoginPage} from "../pages/LoginPage"
import {Editor} from "../pages/Editor"
import {Dashboard} from "../pages/Dashboard"
import {MainPage} from "../pages/MainPage"
import creds from '../auth/creds.json'

test('Создание сессии для lixexog926*', async ({page}) => {
  // Переход на страницу авторизации
  const dashboard = new Dashboard(page)
  const mainPage = new MainPage(page)
  const loginPage = new LoginPage(page)

  await page.goto('/ru')
  await mainPage.logInBtn.click()
  await loginPage.emailInput.fill(creds.email1)
  await loginPage.passwordInput.fill(creds.password1)
  await loginPage.submitBtn.click()
  await dashboard.createDesignBtn.waitFor({timeout:15000})
  await page.waitForURL('/app')

  // Сохранение состояния в файл
  await page.context().storageState({ path: 'auth/auth1.json' });  
})

test('Создание сессии для xedibe9662*', async ({page}) => {
  // Переход на страницу авторизации
  const dashboard = new Dashboard(page)
  const mainPage = new MainPage(page)
  const loginPage = new LoginPage(page)

  await page.goto('/ru')
  await mainPage.logInBtn.click()
  await loginPage.emailInput.fill(creds.email3)
  await loginPage.passwordInput.fill(creds.password3)
  await loginPage.submitBtn.click()
  await dashboard.createDesignBtn.waitFor({timeout:15000})
  await page.waitForURL('/app')

  // Сохранение состояния в файл
  await page.context().storageState({ path: 'auth/auth3.json' });  
})

test('Создание сессии для brekinbeetle*', async ({page}) => {
  // Переход на страницу авторизации
  const dashboard = new Dashboard(page)
  const mainPage = new MainPage(page)
  const loginPage = new LoginPage(page)

  await page.goto('/ru')
  await mainPage.logInBtn.click()
  await loginPage.emailInput.fill(creds.email2)
  await loginPage.passwordInput.fill(creds.password2)
  await loginPage.submitBtn.click()
  await dashboard.createDesignBtn.waitFor({timeout:15000})
  await page.waitForURL('/app')

  // Сохранение состояния в файл
  await page.context().storageState({ path: 'auth/auth2.json' });  
})