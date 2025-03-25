class Editor {
    constructor(page){
        this.page = page
        
        this.decor = page.locator('.story-box-inner__wrapper .decor-layer')                 // Любой декор на холсте
        this.canvas = page.locator('.story-box-inner__wrapper')                             // Холст
        this.canvasBackground = page.locator('.flyvi-decor-background-wrapper')             // Бэкграунд холста
        this.downloadBtn = page.locator('.header button', {hasText:'Скачать'})              // Кнопка скачивани дизайна
        this.changesSavedBtn = page.locator('header button >> text=Изменения сохранены')    // Кнопка Изменения сохранены
        this.continueBtn = page.locator('.dialog-wrapper button >> text = Продолжить редактирование') // Кнопка Продолжить редактирование
        this.changeDesignSizeBtn = page.locator('#editorHeader button >> text=Изменить размер')       // Кнопка редактирования размера дизайна
        this.randomTemplateBtn = page.locator('#decorsDrawer button >> text=Случайный шаблон')        // Кнопка Случайного шаблона
        this.deleteBgBtn = page.locator('button >> text=Удалить фон')                                 // Кнопка Удалить Фон
        this.basketBtn = page.locator('#editorToolbar .defaultPanel_oVC9j button').nth(3)             // Кнопка Корзина
    }
}
export default Editor;