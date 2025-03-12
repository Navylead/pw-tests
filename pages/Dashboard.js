class Dashboard {
    constructor(page){
        this.page = page
        this.userLogo = page.locator('.site-header .profile-name:has-text("Л")')                // Лого юзера
        this.createDesignBtn = page.locator('.site-header button:has-text("Создать дизайн")')   // Кнопка Создать Дизайн
    }
}
export default Dashboard;