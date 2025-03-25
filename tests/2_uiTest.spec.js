// @ts-nocheck
import{test, expect} from "@playwright/test"
import LoginPage from "../pages/LoginPage"
import Editor from "../pages/Editor"
import { timeout } from "../playwright.config"
import Dashboard from "../pages/Dashboard"

test.describe('UI', ()=>{
    test.beforeEach(async({page})=>{
        page.setViewportSize({"width": 1600, "height": 900})
    })

    test.use({ storageState: 'auth/auth1.json' });                    // <<<ФАЙЛ С СОХРАНЁННОЙ СЕССИЕЙ>>>


    test('ГЕНЕРАЦИЯ ФОТО ИИ', async({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/61bb153a-ab29-402c-b5c9-0c303fba998b')
        await expect(editor.downloadBtn).toBeVisible()                      // Отображение кнопки СКАЧАТЬ ДИЗАНЙ
        await page.locator('.flyvi-decors-drawer__menu_wrapper >> text=ИИ-мастерская').click() // Открыть меню ИИ-Генератора
        let tokens = page.locator('.tokens-count_container_count')          // Счётчик токенов для генерации
        const previewImg1 = page.locator('.images img').nth(0)              // Превьюшка первого фото ИИ
        const previewImg2 = page.locator('.images img').nth(1)              // Превьюшка второго фото ИИ
        const genInput = page.locator('textarea')                           // Инпут для промпта
        const genBtn = page.locator('.neuro-btn >> text=Сгенерировать изображение') // Кнопка генерации ФОТО ИИ
        const AISize = page.locator('.neuro-settings .v-input__control').nth(1)     // Меню выбора размеров
        const AIStyle = page.locator('.neuro-settings .styles')                     // Меню выбора стиля генерации
        await expect(tokens).toBeVisible()
        let text = await tokens.innerText()       
        const tokenCounter = parseInt(text)                                 // Счётчик токенов
        if(tokenCounter < 1) {
            throw new Error('<<<НЕДОСТАТОЧНО ТОКЕНОВ>>>')}                  // Вылетает ошибка, если токенов осталось меньше 1
        await genInput.fill('Большой ядерный взрыв')                        // Ввод промпта
        await AISize.click()
        await page.locator('.v-list-item__title >> text=9:16 (576 x 1024)').click() // Выбор размера генерируемой картинки
        await AIStyle.click()
        await page.locator('.styles_item >> text=Энди Уорхол').click()              // Выбор стиля генерируемой картинки
        await expect (genBtn).toBeVisible()                                         // Отображение кнопки начала Генерации
        await genBtn.click()                                                        // Клик по кнопке ГЕНЕРАЦИИ
        await previewImg1.waitFor({ timeout: 13000 })
        await previewImg2.waitFor({ timeout: 13000 })
        const imgs = page.locator('.images img')
        const img1 = page.locator('.images img').nth(0)
        const img2 = page.locator('.images img').nth(1)
        await expect(img1).toBeVisible()            // Проверка, что картинка ИИ опоявилась в меню
        await expect(img2).toBeVisible()            // Проверка, что картинка ИИ опоявилась в меню
        const count = await imgs.count()
        await expect(count).toBe(2)
        tokens = page.locator('.tokens-count_container_count')
        text = await tokens.innerText()  
        const newTokenCounter = parseInt(text)              // Счётчик токенов после генерации
        await expect(newTokenCounter).toBe(tokenCounter-1)  // Проверка, что токены потратились
        await page.pause()
    })

    test.skip('пустой 2', async ({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/79bd981a-9f8c-41ac-ad6c-534492b6edb4')
        await editor.downloadBtn.waitFor()
        await page.pause()
    })

    test.skip('пустой 3', async ({page})=>{
        const editor = new Editor(page)
        await page.goto('/app/designs/a594cd68-4b51-4dfc-b666-de8447afe85b')
        await editor.downloadBtn.waitFor()
        await page.pause()
    })

    test('Проверка ВЕБ-сокета', async({page})=>{
        let startTime, responseTime;
        let response
        const editor = new Editor(page)        

        await page.goto('/app/designs/196eedc2-8c0b-4cff-bb55-9dd3e395792f')
        page.on('websocket', ws=>{
            ws.on('framereceived', frame =>{
                let resp = frame.payload.toString()
                if(resp.includes("updateDecorFields")){
                    response = JSON.parse(resp)                 // Парсим ответ в JSON
                    console.log('JSON', response)
                    responseTime = Date.now()                   // Время получения ответа
                    console.log('ЗАТРАЧЕННОЕ: ', responseTime - startTime);
                    expect(response.action).toEqual('updateDecorFields')
                    if(responseTime - startTime >= 500) {
                        throw new Error('<<<ПРЕВЫШЕНО ВРЕМЯ ОЖИДАНИЯ ОТВЕТА ПО СОКЕТУ>>>')
                    }
                }
            })
        })
        await editor.downloadBtn.waitFor()
        await editor.decor.waitFor()
        await editor.decor.click()
        await page.locator('.design-main-toolbar input').click()
        startTime = Date.now()                                  // Время клика по кнопке
        await page.locator('[id="font-decrement"]').click()     // Кликаем по кнопке уменьшения шрифта *
        await expect(async () => {
            expect(response).toBeDefined();
            expect(response.action).toEqual('updateDecorFields')
        }).toPass({ timeout: 6000 })
        await page.pause()
    })

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
        await page.pause() 
    })

    test('Создание дизайна', async ({page})=>{
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

        await page.pause()
    })

    test('Создание дизайна по своим размерам', async ({page})=>{
        const dashboard = new Dashboard(page)
        const editor = new Editor(page)

        await page.goto('/app')
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

        await page.pause()
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

        await newTab.pause()
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
        console.log('<<<OLDOLDODODLDLDODLDLOD>>>', oldWidth)
        console.log('<<<NEWNWNEWNENEWNENWENWNE>>>', newWidth)
        //const resizeBanner = page.locator('.Vue-Toastification__toast-body >> text=Размер дизайна изменен')
        //await resizeBanner.waitFor()

        await page.pause()
    })

    test('Случайный шаблон', async ({page})=>{
        const editor = new Editor(page)
        let oldBackground, newBackground
        await page.goto('/app/designs/892617f4-7acf-4e1b-add3-adfcaa62e753')
        await editor.changesSavedBtn.waitFor()
        oldBackground = await editor.canvasBackground.evaluate(el => el.dataset.key) // Атрибут фона ДО 
        console.log('<<<oldBackground>>>', oldBackground)
        await editor.randomTemplateBtn.click()                                       // Клик по Случайный Шаблон
        await page.locator('.loading-blur-screen').waitFor({state: 'detached', timeout:10000})
        newBackground = await editor.canvasBackground.evaluate(el => el.dataset.key) // Атрибут фона ПОСЛЕ 
        await expect(oldBackground).not.toEqual(newBackground)
        console.log('<<<newBackground>>>', newBackground)

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

        /// await page.pause()
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
})