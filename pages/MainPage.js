class MainPage {
    constructor(page){
        this.page = page
        this.logInBtn = page.locator('._10RG-m a >> text=Войти')         // Кнопка ВОЙТИ на посадках
    }
}
export default MainPage;