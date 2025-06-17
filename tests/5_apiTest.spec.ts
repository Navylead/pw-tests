// @ts-nocheck
import {test, expect} from "@playwright/test"
import {LoginPage} from "../pages/LoginPage"
import {Editor} from "../pages/Editor"
import { timeout } from "../playwright.config"
import creds from "../auth/creds.json"
import {Dashboard} from "../pages/Dashboard"
import fs from 'fs';

test.describe('ТЕСТЫ АПИ', ()=>{

    test('ЛОГИН', async ({request})=>{
        const respone = await request.post('https://api.flyvi.io/api/auth/login', {
            data: {
                email: creds.email1,
                password: creds.password1
            }})
        const body = await respone.json()
        expect(body.access_token).toBeDefined()
        const token = body.access_token
        await fs.writeFileSync('auth/auth-token.json', JSON.stringify({token}, null, 2));
        expect(body.token_type).toBe('Bearer')
    })

    test('ЛОГИН. Неверный пароль', async ({request})=>{
        const respone = await request.post('https://api.flyvi.io/api/auth/login', {
            data: {
                email: creds.email1,
                password: 'creds.password1'
            }})
        const body = await respone.json()
        expect(body.access_token).toBeUndefined()
        expect(body.message).toContain('Email или пароль введены некорректно')
    })
})