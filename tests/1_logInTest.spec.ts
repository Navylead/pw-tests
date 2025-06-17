// @ts-check
import {test, expect} from "@playwright/test"
import {LoginPage} from "../pages/LoginPage"
import {Editor} from "../pages/Editor"
import {Dashboard} from "../pages/Dashboard"
import RegistrationPage from "../pages/RegistrationPage"
import creds from '../auth/creds.json'


test.describe('Sign in', ()=>{

  test.beforeEach(async({page})=>{
    page.setViewportSize({"width": 1600, "height": 900})
  })

  test.skip('Регистрация пользователя', async({page})=>{
    const login = new LoginPage(page)
    const registration = new RegistrationPage(page)
    const randomNumber = Math.floor(Math.random() * 100)
    const name: string = 'testdelete'
    const email: string = `testdelete${randomNumber}@gmail.com`
    const password: string = '8888888888'

    await page.goto('/app/login')
    await page.waitForURL('/app/login')
    const reqPromise = page.waitForRequest('https://api.flyvi.io/api/auth/register')
    const respPromise = page.waitForResponse('https://api.flyvi.io/api/auth/register')  
    const goToRegistrationBtn = page.locator('.auth-form__header a >> text=Зарегистрируйтесь') // Перейти на страницу Регистрации
    await goToRegistrationBtn.click()
    const registrationByEmail = page.locator('.dialog-wrapper button >> text=Зарегистрироваться')
    await registrationByEmail.click()
    await registration.nameInput.fill(name)                     // Инпут Имя
    await registration.emailInput.fill(email)                   // Инпут почты
    await registration.passwordInput.fill(password)             // Инпут Пароля
    await registration.checkBoxTermOfUse.click()                // Чекбокс №1
    await registration.beginWorkBtn.click()                     // Кнопка Начать Работу

    const req = await reqPromise
    const reqBody = await JSON.parse(req.postData() ?? '{}')
    expect(reqBody.email).toEqual(email)
    expect(reqBody.password).toEqual(password)

    const resp = await respPromise					
    const respBody = await resp.json()
    expect(respBody.message).toEqual("Ваш аккаунт был создан.")

    await page.waitForURL('/app/login')
    await page.locator('[class="dialog-wrapper dialog-wrapper__success"] h2 >> text=Ещё немного!').isVisible()
    await page.locator('[class="dialog-wrapper dialog-wrapper__success"] button >> text=Хорошо').isVisible()
    await page.pause()
  })

  test('Регистрация использующимся EMAIL', async ({page})=>{
    const login = new LoginPage(page)
    const registration = new RegistrationPage(page)
  
    await page.goto('/app/login')
    await page.waitForURL('/app/login')
    const goToRegistrationBtn = page.locator('.auth-form__header a >> text=Зарегистрируйтесь') // Перейти на страницу Регистрации
    await goToRegistrationBtn.click()
    const registrationByEmail = page.locator('.dialog-wrapper button >> text=Зарегистрироваться')
    await registrationByEmail.click()
    await registration.nameInput.fill('any_name')
    await registration.emailInput.fill(creds.email1)
    await registration.passwordInput.fill('0123123123')
    await registration.checkBoxTermOfUse.click()
    await registration.beginWorkBtn.click()

    const response = await page.waitForResponse('**/api/auth/register')
    const jsonResponse = await response.json()
    expect(jsonResponse.errors.email[0]).toEqual('Данный email уже зарегистрирован');

    const errorMessage = page.locator('div >> text=Данный email уже зарегистрирован')
    await errorMessage.waitFor()

    await page.pause()
  })

  test('АВТОРИЗАЦИЯ корректными кредами', async({page})=>{
  const loginPage = new LoginPage(page)
  const dashboard = new Dashboard(page)
  
  await page.goto('/app/login')       // Переход на страницу авторизации    
  await loginPage.emailInput.fill(creds.email1)       // Ввод логина  
  await loginPage.passwordInput.fill(creds.password1) // Ввод пароля  
  await loginPage.submitBtn.click()   // Нажатие на кнопку авторизации

  const loginAPI = await page.waitForResponse(res=>
    res.url() === 'https://api.flyvi.io/api/auth/login'
  )
  const token = await loginAPI.json()
  expect(token.access_token).not.toEqual('')
  //fs.writeFileSync('token.json', token.access_token)        <<Запись токена в файл>>
  const meAPI = await page.waitForResponse(res=>
    res.url() === 'https://api.flyvi.io/api/auth/me'
  )
  const body = await meAPI.json()
  expect(body.user.id).toEqual(89671)
  expect(body.user.name).toEqual('Ликси')
  expect(body.user.email).toEqual(creds.email1)
  expect(body.user.tariff.name).toEqual('Business')

  // Ожидание успешного перехода на главную страницу
  await page.waitForURL('https://flyvi.io/app')
  // Проверка, что авторизация была успешной (например, отображение кнопки СОЗДАТЬ ДИЗАЙН)
  await dashboard.createDesignBtn.waitFor()
  await page.pause()
})

test('Восстановить пароль', async ({page})=>{
  const loginPage = new LoginPage(page)
  const dashboard = new Dashboard(page)
  const email = 'navyleadreel@gmail.com'
  await page.goto('/app/login')
  await loginPage.restoreBtn.click()
  await page.locator('.auth-form__main input[id="email"]').click()
  await page.locator('.auth-form__main input[id="email"]').fill(email)
  await page.locator('.auth-form__main button >> text=Восстановить пароль').click()
  const response = await page.waitForResponse(res=>
    res.url() === 'https://api.flyvi.io/api/password/forgot'
  )
  const message = await response.json()
  expect(message.message).toEqual('На email выслано письмо для сброса пароля.')
  await page.pause()
})

test('АВТОРИЗАЦИЯ. Пустые поля', async ({page})=>{
  const loginPage = new LoginPage(page)
  await page.goto('/app/login')
  await loginPage.submitBtn.click()
  const message1 = page.locator('.v-messages__message').nth(0)
  await expect(message1).toHaveText('E-mail не может быть пустым')
  await expect(message1).toBeVisible()
  const message2 = page.locator('.v-messages__message').nth(1)
  //await expect(message2).toBeVisible()
  await page.pause()
})

test('АВТОРИЗАЦИЯ. Неверные креды', async ({page})=>{
  const loginPage = new LoginPage(page)
  const wrongCreds = ['lolololo@laluxy.com', '9876543210']
  await page.goto('/app/login')
  await loginPage.emailInput.fill(wrongCreds[0])
  await loginPage.passwordInput.fill(wrongCreds[1])
  await loginPage.submitBtn.click()
  const errorMessage = page.locator('.error-messages')
  await expect(errorMessage).toHaveText('Email или пароль введены некорректно.')
  await expect(errorMessage).toBeVisible()
  await page.pause()
})
})

