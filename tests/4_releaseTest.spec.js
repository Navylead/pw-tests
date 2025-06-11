// @ts-nocheck
import{test, expect} from "@playwright/test"
import LoginPage from "../pages/LoginPage"
import Editor from "../pages/Editor"
import { timeout } from "../playwright.config"
import creds from "../auth/creds.json"
import Dashboard from "../pages/Dashboard"


test.describe('Релизные тесты', ()=>{

test.describe('Тесты премиумности', ()=>{
    test.beforeEach(async({page})=>{
        page.setViewportSize({"width": 1600, "height": 900})
    })

    test.use({ storageState: 'auth/auth3.json' });                    // <<<ФАЙЛ С СОХРАНЁННОЙ СЕССИЕЙ>>>

    test('Скачивание премиум-элемента: ИКОНКА', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const allPagesMenu = page.locator('button >> text=Все страницы')
        await allPagesMenu.click()
        const allPages = page.locator('[role="menu"]').nth(1).locator('button >> text=Все страницы')
        await allPages.click()
        const currentPage = page.locator('[role="menu"]').nth(1).locator('button >> text=Страница 1').nth(0)
        await currentPage.click()
        const doneBtn = page.locator('[role="menu"]').nth(1).locator('button').getByText('Готово')
        await doneBtn.click()
        const downloadButton = page.locator('.site-story-download__menu button >> text=Скачать')
        await downloadButton.waitFor()
        await downloadButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()

        //await page.pause()
    })

    test('Скачивание премиум-элемента: ВЕКТОР', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const allPagesMenu = page.locator('button >> text=Все страницы')
        await allPagesMenu.click()
        const allPages = page.locator('[role="menu"]').nth(1).locator('button >> text=Все страницы')
        await allPages.click()
        const currentPage = page.locator('[role="menu"]').nth(1).locator('button >> text=Страница 2')
        await currentPage.click()
        const doneBtn = page.locator('[role="menu"]').nth(1).locator('button').getByText('Готово')
        await doneBtn.click()
        const downloadButton = page.locator('.site-story-download__menu button >> text=Скачать')
        await downloadButton.waitFor()
        await downloadButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Скачивание премиум-элемента: ШРИФТ', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const allPagesMenu = page.locator('button >> text=Все страницы')
        await allPagesMenu.click()
        const allPages = page.locator('[role="menu"]').nth(1).locator('button >> text=Все страницы')
        await allPages.click()
        const currentPage = page.locator('[role="menu"]').nth(1).locator('button >> text=Страница 3')
        await currentPage.click()
        const doneBtn = page.locator('[role="menu"]').nth(1).locator('button').getByText('Готово')
        await doneBtn.click()
        const downloadButton = page.locator('.site-story-download__menu button >> text=Скачать')
        await downloadButton.waitFor()
        await downloadButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Скачивание премиум-элемента: АНИМАЦИЯ', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const allPagesMenu = page.locator('button >> text=Все страницы')
        await allPagesMenu.click()
        const allPages = page.locator('[role="menu"]').nth(1).locator('button >> text=Все страницы')
        await allPages.click()
        const currentPage = page.locator('[role="menu"]').nth(1).locator('button >> text=Страница 4')
        await currentPage.click()
        const doneBtn = page.locator('[role="menu"]').nth(1).locator('button').getByText('Готово')
        await doneBtn.click()
        const downloadButton = page.locator('.site-story-download__menu button >> text=Скачать')
        await downloadButton.waitFor()
        await downloadButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test.skip('Скачивание премиум-элемента: АНИМАЦИЯ для декоров <<<НЕ РАБОТАЕТ!!!>>>', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const allPagesMenu = page.locator('button >> text=Все страницы')
        await allPagesMenu.click()
        const allPages = page.locator('[role="menu"]').nth(1).locator('button >> text=Все страницы')
        await allPages.click()
        const currentPage = page.locator('[role="menu"]').nth(1).locator('button >> text=Страница 5')
        await currentPage.click()
        const doneBtn = page.locator('[role="menu"]').nth(1).locator('button').getByText('Готово')
        await doneBtn.click()
        const downloadButton = page.locator('.site-story-download__menu button >> text=Скачать')
        await downloadButton.waitFor()
        await downloadButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Скачивание премиум-элемента: ФИГУРА', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const allPagesMenu = page.locator('button >> text=Все страницы')
        await allPagesMenu.click()
        const allPages = page.locator('[role="menu"]').nth(1).locator('button >> text=Все страницы')
        await allPages.click()
        const currentPage = page.locator('[role="menu"]').nth(1).locator('button >> text=Страница 6')
        await currentPage.click()
        const doneBtn = page.locator('[role="menu"]').nth(1).locator('button').getByText('Готово')
        await doneBtn.click()
        const downloadButton = page.locator('.site-story-download__menu button >> text=Скачать')
        await downloadButton.waitFor()
        await downloadButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Скачивание премиум-элемента: ЭЛЕМЕНТ', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const allPagesMenu = page.locator('button >> text=Все страницы')
        await allPagesMenu.click()
        const allPages = page.locator('[role="menu"]').nth(1).locator('button >> text=Все страницы')
        await allPages.click()
        const currentPage = page.locator('[role="menu"]').nth(1).locator('button >> text=Страница 7')
        await currentPage.click()
        const doneBtn = page.locator('[role="menu"]').nth(1).locator('button').getByText('Готово')
        await doneBtn.click()
        const downloadButton = page.locator('.site-story-download__menu button >> text=Скачать')
        await downloadButton.waitFor()
        await downloadButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Скачивание премиум-элемента: ШАБЛОН', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const allPagesMenu = page.locator('button >> text=Все страницы')
        await allPagesMenu.click()
        const allPages = page.locator('[role="menu"]').nth(1).locator('button >> text=Все страницы')
        await allPages.click()
        const currentPage = page.locator('[role="menu"]').nth(1).locator('button >> text=Страница 8')
        await currentPage.click()
        const doneBtn = page.locator('[role="menu"]').nth(1).locator('button').getByText('Готово')
        await doneBtn.click()
        const downloadButton = page.locator('.site-story-download__menu button >> text=Скачать')
        await downloadButton.waitFor()
        await downloadButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Скачивание премиум-элемента: МАСКА', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const allPagesMenu = page.locator('button >> text=Все страницы')
        await allPagesMenu.click()
        const allPages = page.locator('[role="menu"]').nth(1).locator('button >> text=Все страницы')
        await allPages.click()
        const currentPage = page.locator('[role="menu"]').nth(1).locator('button >> text=Страница 9')
        await currentPage.click()
        const doneBtn = page.locator('[role="menu"]').nth(1).locator('button').getByText('Готово')
        await doneBtn.click()
        const downloadButton = page.locator('.site-story-download__menu button >> text=Скачать')
        await downloadButton.waitFor()
        await downloadButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Скачивание премиум-элемента: ФОН', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a9d4defc-7041-452a-91c4-9c9569eceea6')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const allPagesMenu = page.locator('button >> text=Все страницы')
        await allPagesMenu.click()
        const allPages = page.locator('[role="menu"]').nth(1).locator('button >> text=Все страницы')
        await allPages.click()
        const currentPage = page.locator('[role="menu"]').nth(1).locator('button >> text=Страница 1').nth(1)
        await currentPage.click()
        const doneBtn = page.locator('[role="menu"]').nth(1).locator('button').getByText('Готово')
        await doneBtn.click()
        const downloadButton = page.locator('.site-story-download__menu button >> text=Скачать')
        await downloadButton.waitFor()
        await downloadButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Премиум-функция: ПРОЗРАЧНЫЙ ФОН', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/bfa1beaf-4a61-44b1-9596-4cf4cac3b25d')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const background = page.locator('.site-story-download__menu div >> text=Прозрачный фон')
        await background.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Премиум-функция: ОТОБРАЖЕНИЕ ВОДЯНОГО ЗНАКА', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/bfa1beaf-4a61-44b1-9596-4cf4cac3b25d')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const watermark = page.locator('.site-story-download__menu div >> text=Отображение водяного знака')
        await watermark.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Премиум-функция: РАЗМЕР Х', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/bfa1beaf-4a61-44b1-9596-4cf4cac3b25d')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()
        const sizeBtn = page.locator('.site-story-download__menu').locator('text=Размер')
        await sizeBtn.waitFor()
        await sizeBtn.click({force:true})
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Премиум-функция: ИЗМЕНИТЬ РАЗМЕР ДИЗАЙНА', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/bfa1beaf-4a61-44b1-9596-4cf4cac3b25d')
        await editor.changesSavedBtn.waitFor()
        await editor.changeDesignSizeBtn.click()
        const designType = page.locator('[role="menu"] [role="option"] >> text=Резюме')
        await designType.click()
        const changeButton = page.locator('[role="menu"] button >> text=Изменить').first()
        await changeButton.waitFor()
        await changeButton.click()        
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Премиум-функция: ДЕФОРМАЦИЯ ДЛЯ ФОТО', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/bfa1beaf-4a61-44b1-9596-4cf4cac3b25d')
        await editor.changesSavedBtn.waitFor()
        await editor.decor.click()
        const deformationButton = page.locator('#editorToolbar button').getByText('Деформация')
        await deformationButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Премиум-функция: УДАЛИТЬ ФОН ДЛЯ ФОТО', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/bfa1beaf-4a61-44b1-9596-4cf4cac3b25d')
        await editor.changesSavedBtn.waitFor()
        await editor.decor.click()
        const deformationButton = page.locator('#editorToolbar button').getByText('Удалить фон')
        await deformationButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })

    test('Премиум-функция: ЛАСТИК ДЛЯ ФОТО', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/bfa1beaf-4a61-44b1-9596-4cf4cac3b25d')
        await editor.changesSavedBtn.waitFor()
        await editor.decor.click()
        const deformationButton = page.locator('#editorToolbar button').getByText('Стереть')
        await deformationButton.click()
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        // await page.pause()
    })

    test('Переход на тариф ПРО из ЛК', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app')
        const drawer = page.locator('text=Попробовать Flyvi Pro')
        await drawer.click()        
        const getTariffBtn = page.locator('.dialogWrapper_FVcGt button >> text=Получить бесплатную пробную версию')
        await getTariffBtn.waitFor()
        
        //await page.pause()
    })
})

test.describe('ОБЩИЕ ПО ЭДИТОРУ', ()=>{
    test.beforeEach(async({page})=>{
        page.setViewportSize({"width": 1600, "height": 900})
    })
    test.use({ storageState: 'auth/auth1.json' });                    // <<<ФАЙЛ С СОХРАНЁННОЙ СЕССИЕЙ>>>

    test('Скачивание дизайна JPG', async ({page})=>{
        const editor = new Editor(page)

        const responses = []                                    // Массив с ответами АПИ скачивания дизайна
        page.on('response', async resp=>{
            if(resp.url().includes('/download-status')){
                responses.push(resp)}                           // Перехват всех ответов АПИ скачивания
        })
        await page.goto('/app/designs/2a24881a-930d-4a11-a034-969632f9e74c')
        await editor.changesSavedBtn.waitFor()
        await editor.downloadBtn.click()                        // Клик по кнопке СКАЧАТЬ
        const designType = page.locator('.site-story-download__menu [role="button"] >> text=PNG')
        await designType.click()                                // Клик по меню выбора формата дизайна
        await page.locator('text = JPG').click()                // Выбор формата  JPG
        const menuDownloadBtn = page.locator('.site-story-download__menu button >> text = Скачать')
        await menuDownloadBtn.click()                           // Скачать дизайн
        await editor.continueBtn.waitFor({timeout:18000})       // Ожидание появления меню после скачивания дизайна
        const lastResp = responses[responses.length-1]          // Последний ответ АПИ
		const respBody = await lastResp.json()                  // Парсим ответ
        expect(respBody.status).toEqual('DONE')                 // Проверка, что по АПИ приходит стаутс DONE
        // console.log('ДЛИНА МАССИВА - ', responses.length)
        //await page.pause() 
    })

    test('Создание дизайна - История Instagram', async ({page})=>{
        const dashboard = new Dashboard(page)
        const editor = new Editor(page)

        await page.goto('/app')
        await dashboard.createDesignBtn.waitFor()
        await dashboard.createDesignBtn.click()
        await page.locator('.category >> text=Соцсети').click()
        await page.locator('.category >> text=История Instagram').click()
        await page.waitForURL('**/designs/*')
        await editor.changeDesignSizeBtn.waitFor()
        await editor.downloadBtn.waitFor()

        //await page.pause()
    })

    test('Создание дизайна по своим размерам', async ({page})=>{
        const dashboard = new Dashboard(page)
        const editor = new Editor(page)

        await page.goto('/app')
        const designList = page.locator('.stories-list .v-responsive__content').first()
        await designList.waitFor()
        await dashboard.createDesignBtn.waitFor()
        await dashboard.createDesignBtn.click()
        const customSizeButton = page.locator('[role="menu"] button >> text=Настраиваемый размер')
        await customSizeButton.click()
        const widthInput = page.locator('.custom-design-menu input').first()
        await widthInput.clear()
        await widthInput.fill('2222')
        const height = page.locator('.custom-design-menu input').nth(1)
        await height.clear()
        await height.fill('2222')
        const createCustomDesignButton = page.locator('.custom-design-menu button >> text=Создать дизайн')
        await createCustomDesignButton.click()
        await page.waitForURL('**/designs/*')
        await editor.changeDesignSizeBtn.waitFor()
        await editor.downloadBtn.waitFor()

        await editor.canvas.isVisible()
        const designSize = await editor.canvas.evaluate(el=>{
            return {
                height: el.clientHeight,
                width: el.clientWidth}
        })
        expect(designSize.height).toEqual(2222)
        expect(designSize.width).toEqual(2222)        

        // await page.pause()
    })

    test('Создание WEB-STORY', async ({page, context})=>{
        const dashboard = new Dashboard(page)
        const editor = new Editor(page)

        await page.goto('/app')
        await dashboard.createDesignBtn.waitFor()
        await page.locator('[href="/app/dashboard"]').click()
        const createStoryButton = page.locator('button >> text=Создать сторис')  

        // ПЕРЕХОД НА НОВУЮ ВКЛВДКУ
        const [newTab] = await Promise.all([
            context.waitForEvent('page'),
            createStoryButton.click() // Клик по кнопке
      ])
        const publishButton = newTab.locator('#editorHeader button >> text=Опубликовать на сайте')
        const chooseAlbumButton = newTab.locator('#editorHeader button >> text=Выбрать альбом')
        await publishButton.isVisible()
        await chooseAlbumButton.isVisible()
        await publishButton.click()

        // await newTab.pause()
    })

    test('Изменение размера дизайна', async({page})=>{
        const editor = new Editor(page)
        let oldWidth, newWidth
        const randomNumber = Math.floor(100 + Math.random() * 900)

        await page.goto('/app/designs/0c0837e6-e171-4e09-b590-45d3554a4da0')
        await editor.changesSavedBtn.isVisible()
        oldWidth = await editor.canvas.evaluate(el=>el.clientWidth)
        await editor.changeDesignSizeBtn.click()
        const setSizeButton = page.locator('button >> text=Настраиваемый размер')
        await setSizeButton.click()
        const widthInput = page.locator('.change-size-actions input').first()
        await widthInput.clear()
        await widthInput.fill('1'+randomNumber)
        const changeSizeButton = page.locator('.change-size-actions button >> text=Изменить').first()
        // await changeSizeButton.highlight()
        await changeSizeButton.click()
        newWidth = await editor.canvas.evaluate(el => el.clientWidth)
        await expect(oldWidth).not.toEqual(newWidth)
        // console.log('<<<OLDOLDODODLDLDODLDLOD>>>', oldWidth)
        // console.log('<<<NEWNWNEWNENEWNENWENWNE>>>', newWidth)
        // const resizeBanner = page.locator('.Vue-Toastification__toast-body >> text=Размер дизайна изменен')
        // await resizeBanner.waitFor()

        // await page.pause()
    })

    test('Случайный шаблон', async ({page})=>{
        const editor = new Editor(page)
        let oldBackground, newBackground
        await page.goto('/app/designs/892617f4-7acf-4e1b-add3-adfcaa62e753')
        await editor.changesSavedBtn.waitFor()
        oldBackground = await editor.canvasBackground.evaluate(el => el.dataset.key) // Атрибут фона ДО 
        // console.log('<<<oldBackground>>>', oldBackground)
        await editor.randomTemplateBtn.click()                                       // Клик по Случайный Шаблон
        await page.locator('.loading-blur-screen').waitFor({state: 'detached', timeout:10000})
        newBackground = await editor.canvasBackground.evaluate(el => el.dataset.key) // Атрибут фона ПОСЛЕ 
        await expect(oldBackground).not.toEqual(newBackground)
        // console.log('<<<newBackground>>>', newBackground)

        await page.pause()
    })

    test('УДАЛЕНИЕ ФОНА У ФОТО АПЛОАД', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/3ba00c33-3def-4599-b474-b5429c86af82')
        await editor.changeDesignSizeBtn.waitFor()
        await editor.decor.locator('img:not([src*="no-bg"])').last().click({force:true})       // клик по декору на холсте
        await editor.deleteBgBtn.click()                                                       // Клик по Удалению фона
        await page.locator('.loading-blur-screen').waitFor({state: 'detached', timeout:10000}) // Ожидание завершения процесса
        const noBgImg = editor.canvas.locator('[src*="no-bg"]')
        await noBgImg.waitFor({timeout:10000})      // Ждем, пока на холсте не появится фото БЕЗ фона
        await noBgImg.click({force:true})           // Клик по фото БЕЗ фона
        await editor.basketBtn.click()              // Удалить это фото
        await editor.decor.last().click({force:true})

        // await page.pause()
    })

    test('УДАЛЕНИЕ ФОНА У ФОТО ИИ', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/df8778a4-80bc-41c7-9832-a827bc92439b')
        await editor.changeDesignSizeBtn.waitFor()
        await editor.decor.locator('img:not([src*="no-bg"])').last().click({force:true})       // клик по декору на холсте
        await editor.deleteBgBtn.click()                                                       // Клик по Удалению фона
        await page.locator('.loading-blur-screen').waitFor({state: 'detached', timeout:10000}) // Ожидание завершения процесса
        const noBgImg = editor.canvas.locator('[src*="no-bg"]')
        await noBgImg.waitFor({timeout:10000})      // Ждем, пока на холсте не появится фото БЕЗ фона
        await noBgImg.click({force:true})           // Клик по фото БЕЗ фона
        await editor.basketBtn.click()              // Удалить это фото
        await editor.decor.last().click({force:true})

        // await page.pause()
    })

    test('УДАЛЕНИЕ ФОНА У ФОТО АНСПЛЭШ', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/c6454766-a526-4c1c-a6e2-35dd47af8812')
        await editor.changeDesignSizeBtn.waitFor()
        await editor.decor.locator('img:not([src*="no-bg"])').last().click({force:true})       // клик по декору на холсте
        await editor.deleteBgBtn.click()                                                       // Клик по Удалению фона
        await page.locator('.loading-blur-screen').waitFor({state: 'detached', timeout:10000}) // Ожидание завершения процесса
        const noBgImg = editor.canvas.locator('[src*="no-bg"]')
        await noBgImg.waitFor({timeout:10000})      // Ждем, пока на холсте не появится фото БЕЗ фона
        await noBgImg.click({force:true})           // Клик по фото БЕЗ фона
        await editor.basketBtn.click()              // Удалить это фото
        await editor.decor.last().click({force:true})

        // await page.pause()
    })

    test('ИИ-мастерская. Генерация ФОТО', async({page})=>{
        const editor = new Editor(page)
        const dashboard = new Dashboard(page)
        let oldCount, newCount        
        await page.goto('/app/image-generator')        
        await dashboard.tokenCount.waitFor()

        const tk = page.locator('.header .span-text >> text=Токены')
        await tk.highlight()
        const text2 = await tk.evaluate(text => text.textContent)
        const text1 = await tk.textContent()
        await expect(text2.trim()).toEqual('Токены')
        await expect(text1.trim()).toEqual('Токены')

        await expect(async ()=>{
            const tokenText = await dashboard.tokenCount.textContent()
            oldCount = Number(tokenText)
            expect(oldCount, '<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>').toBeGreaterThan(0)
        }).toPass({timeout:10000})    

        await dashboard.imgPrompt.fill('картонный кот')
        const styleBtn = page.locator('.ai-generator__main >> text="Без стиля"')
        await styleBtn.click()
        const cinemaStyle = page.locator('.styles_items-wrapper >> text="Кинематографический"')
        await cinemaStyle.click()
        await dashboard.imgGenerateBtn.click()
        const newImgs = page.locator('.ai-generator__history div[id*="section"]').nth(0).locator('img[src*="flyvi.io/ai-history"]')
        await expect(async ()=>{            
            const imgSize = await newImgs.evaluateAll(imgs =>
                imgs.every(img => img.naturalHeight > 0))
        }).toPass()        

        const text2img = page.waitForResponse('**/api/text2img?prompt=*', {timeout:20000})    
        const response = await text2img
        const json = await response.json()
        await expect(json.data.prompt_ru).toEqual('картонный кот')
        await expect(json.data.images[0].model).toEqual('playground')                  // Модель playground
        await expect(json.data.images[0].path).toContain('.jpg')
        await expect(json.data.images[1].model).toEqual('stablecascade')               // Модель stablecascade
        await expect(json.data.images[1].path).toContain('.jpg')
        await expect(json.data.images[2].model).toEqual('sd')                          // Модель sd
        await expect(json.data.images[2].path).toContain('.jpg')
        await expect(json.data.images[3].model).toEqual('flux')                        // Модель flux
        await expect(json.data.images[3].path).toContain('.jpg')

        await expect(async ()=>{            
            const imgSize = await newImgs.evaluateAll(imgs =>
                imgs.every(img => img.naturalHeight > 0)
            )
        }).toPass()
        // await newImgs.highlight()
        await expect(async ()=>{
            const tokenText = await dashboard.tokenCount.textContent()
            newCount = Number(tokenText)
            expect(oldCount, '<<<ТОКЕНЫ НЕ ПОТРАТИЛИСЬ>>>').toEqual(newCount+1)
        }).toPass({timeout:10000})  

        // await page.pause()
    })

    test('ИИ-мастерская. Открыть фото в дизайне', async ({page, context})=>{
        const editor = new Editor(page)
        const dashboard = new Dashboard(page)
        // Переход в ИИ-мастерскую
        await page.goto('/app/image-generator')
        await dashboard.tokenCount.waitFor()
        // Выбираем первую сгенерированную картинку и кликаем по ней
        const imgHistory = page.locator('img[src*="/ai-history/"]').nth(0)
        await imgHistory.waitFor()
        const imgLink = await imgHistory.evaluate(img => img.getAttribute('src'))
        await imgHistory.click()
        // Проверяем, что ссылка на фото в истории и в открывшемся попапе одинаковые
        const imgPreview = await page.locator('.dialog-wrapper img[src*="/ai-history/"]')
        const imgPreviewLink = await imgPreview.evaluate(img => img.getAttribute('src'))
        await expect(imgPreviewLink).toEqual(imgLink)
        // Кликаем по кнопке "Использовать в дизайне"
        const createDesignFromBtn = page.locator('.dialog-wrapper button >> text=Использовать в дизайне')
        const [newTab] = await Promise.all([
            context.waitForEvent('page'),
            createDesignFromBtn.click() // Клик по кнопке
        ])
        // Ждём перехода на другую вкалдку и проверяем, что есть фото на холсте
        await newTab.waitForURL('**/designs/*', {timeout:10000})
        const downloadBtn = newTab.locator('.header button >> text=Скачать')
        await downloadBtn.waitFor()
        const canvasImg = newTab.locator('.story-box-inner__wrapper img')  
        await canvasImg.waitFor()
        // console.log('<<<LINK>>>', canvasImgLink)       

        // await page.pause()
    })    
})
})