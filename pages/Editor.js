class Editor {
    constructor(page){
        this.page = page
        
        this.decor = page.locator('.story-box-inner__wrapper .decor-layer')                 // Любой декор на холсте
        this.canvas = page.locator('.story-box-inner__wrapper')                             // Холст
        this.downloadBtn = page.locator('.header button', {hasText:'Скачать'})              // Кнопка скачивани дизайна
        this.changesSavedBtn = page.locator('header button >> text=Изменения сохранены')    // Кнопка Изменения сохранены
        this.continueBtn = page.locator('.dialog-wrapper button >> text = Продолжить редактирование') // Кнопка Продолжить редактирование
        this.changeDesignSizeBtn = page.locator('#editorHeader button >> text=Изменить размер')       // Кнопка редактирования размера дизайна
        
    }
}
export default Editor;