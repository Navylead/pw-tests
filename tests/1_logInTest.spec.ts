// @ts-check
import {test, expect} from "@playwright/test"
import {LoginPage} from "../pages/LoginPage"
import {Editor} from "../pages/Editor"
import {Dashboard} from "../pages/Dashboard"
import RegistrationPage from "../pages/RegistrationPage"
import creds from '../auth/creds.json'
import auth1 from '../auth/auth1.json'


test.describe('Registration', ()=>{
  test.beforeEach(async({page})=>{
    page.setViewportSize({"width": 1600, "height": 900})
  })

  test('Регистрация по паролю с моком', async({page})=>{
    const register = new RegistrationPage(page)
    await page.route('**/api/auth/register', async route =>{
      await route.fulfill({
        status: 201,
        body: JSON.stringify({
          message: "Ваш аккаунт был создан."
      })
      })
    })
    const mockName: string = 'mock_user'
    const mockEmail: string = 'testmock@gmail.com'
    const password: string = '0123456789'
    // Регистрация
    await register.register(mockName, mockEmail, password)
    // Отображение попапа успешной регистрации
    const registrationDonePopap = page.locator('.auth-form__wrapper')
    const registrationDoneBtn = registrationDonePopap.locator('button:has-text("Хорошо")')
    await registrationDonePopap.waitFor() // Попап
    await registrationDoneBtn.waitFor()   // Кнопка    

    await page.pause()
  })

  test('Регистрация по коду с моком', async ({page})=>{
    const register = new RegistrationPage(page)
    const dashboard = new Dashboard(page)
    // Мокируем ответ АПИ регистрации
    await page.route('**/api/register/code', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          message: "Ваш аккаунт был создан." 
        })
      })
    })
    // Мокируем ответ АПИ верификации
    await page.route('**/api/verify/code', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: auth1.origins[0].localStorage[11].value.slice(7),
          token_type: "Bearer"
        })
      })
    })

    // Регистрация по коду
    let mockEmail: string = 'string128128@mail.ru', mockName: string = 'ПО КОДУ'
    await page.goto('/app/login')
    await page.locator('text=Зарегистрируйтесь').click()
    await page.locator('[placeholder="Введите полное имя"]').fill(mockName)
    await page.locator('[placeholder="Введите адрес электронной почты"]').fill(mockEmail)
    const [registerResponse] = await Promise.all([
      page.waitForResponse('**/api/register/code'),
      register.registrationByCodeBtn.click()          
    ])
    // const registerMessage = await response.json()
    // console.log(registerMessage);
    const codeInputs = page.locator('.dialog_code')
    await expect(codeInputs).toBeVisible()
    for(let i = 0; i < 4; i++) {
      await codeInputs.locator('input').nth(i).fill('9')
    }
    await register.checkBoxTermOfUse.click()
    const [verifyResponse] = await Promise.all([
      page.waitForResponse('**/api/verify/code'),
      register.registrationBtn.click()
    ])
    // const verifyMessage = await verifyResponse.json()
    // console.log(verifyMessage);
    await dashboard.createDesignBtn.waitFor()

    await page.pause()
  })

  test.skip('Регистрация пользователя', async({page})=>{
    const register = new RegistrationPage(page)
    const randomNumber = Math.floor(Math.random() * 100)
    const name: string = 'testdelete'
    const email: string = `testdelete${randomNumber}@gmail.com`
    const password: string = '8888888888'
    
    const reqPromise = page.waitForRequest('https://api.flyvi.io/api/auth/register')
    const respPromise = page.waitForResponse('https://api.flyvi.io/api/auth/register')  
    // Регистрация
    await register.register(name, email, password)

    const req = await reqPromise
    const reqBody = await JSON.parse(req.postData() ?? '{}')
    expect(reqBody.email).toEqual(email)
    expect(reqBody.password).toEqual(password)

    const resp = await respPromise					
    const respBody = await resp.json()
    expect(respBody.message).toEqual("Ваш аккаунт был создан.")
    await page.locator('[class="dialog-wrapper dialog-wrapper__success"] h2 >> text=Ещё немного!').isVisible()
    await page.locator('[class="dialog-wrapper dialog-wrapper__success"] button >> text=Хорошо').isVisible()

    await page.pause()
  })

  test('Регистрация использующимся EMAIL', async ({page})=>{
    const register = new RegistrationPage(page)
    const name: string = 'testdelete'
    const email: string = creds.email1
    const password: string = '8888888888'  
    // Регистрация
    await register.register(name, email, password)
    const response = await page.waitForResponse('**/api/auth/register')
    const jsonResponse = await response.json()
    expect(jsonResponse.errors.email[0]).toEqual('Данный email уже зарегистрирован')
    const errorMessage = page.getByText('Данный email уже зарегистрирован')
    await errorMessage.waitFor()

    await page.pause()
  })
})

test.describe('Sign in', ()=>{

  test.beforeEach(async({page})=>{
    page.setViewportSize({"width": 1600, "height": 900})
  })

  test('АВТОРИЗАЦИЯ корректными кредами', async({page})=>{
  const loginPage = new LoginPage(page)
  const dashboard = new Dashboard(page)
  // Авторизация
  await loginPage.login(creds.email1, creds.password1)   
  // Проверка ответов АПИ для "login" "me"
  expect(loginPage.loginResponse.access_token).not.toEqual('')
  // fs.writeFileSync('token.json', token.access_token)        <<Запись токена в файл>>  
  expect(loginPage.meResponse.user.id).toEqual(89671)
  expect(loginPage.meResponse.user.name).toEqual('Ликси')
  expect(loginPage.meResponse.user.email).toEqual(creds.email1)
  expect(loginPage.meResponse.user.tariff.name).toEqual('Business')
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
  await loginPage.loginByPasswordBtn.waitFor()
  await loginPage.loginByPasswordBtn.click()
  await loginPage.submitBtn.click()
  const message1 = page.locator('.v-messages__message').nth(0)
  await expect(message1).toHaveText('E-mail не может быть пустым')
  await expect(message1).toBeVisible()
  const message2 = page.locator('.v-messages__message').nth(1)
  // await expect(message2).toBeVisible()
  await page.pause()
})

test('АВТОРИЗАЦИЯ. Неверные креды', async ({page})=>{
  const loginPage = new LoginPage(page)
  const wrongCreds = ['lolololo@laluxy.com', '9876543210']
  await page.goto('/app/login')
  await loginPage.loginByPasswordBtn.waitFor()
  await loginPage.loginByPasswordBtn.click()
  await loginPage.emailInput.fill(wrongCreds[0])
  await loginPage.passwordInput.fill(wrongCreds[1])
  await loginPage.submitBtn.click()
  const errorMessage = page.locator('.error-messages')
  await expect(errorMessage).toHaveText('Email или пароль введены некорректно.')
  await expect(errorMessage).toBeVisible()

  await page.pause()
})
})

