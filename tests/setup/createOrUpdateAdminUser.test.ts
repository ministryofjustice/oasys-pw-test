import { test } from 'fixtures'
import { testEnvironment } from 'localSettings'

const t2 = testEnvironment.name.includes('T2')


// This user is used only for setting up the admin users that will be used by Playwright
const globalAdminUser = 'CENTRALSUPPORTONE'

test('Create or update admin user', async ({ oasysDb, oasys, user, maintenance }) => {

    // Check if user exists
    const userCount = await oasysDb.selectCount(`select count(*) from eor.oasys_user where oasys_user_code = '${user.admin.username}'`)
    let newUser = userCount == 0

    for (const profile of user.adminProfiles) {

        await user.adhocLogin(globalAdminUser, testEnvironment.globalAdminUserPassword, profile.provider)

        if (newUser) {
            await maintenance.userAccounts.goto()
            await maintenance.userAccounts.createAccount.click()
            await maintenance.maintainUser.userName.setValue(user.admin.username)
            await maintenance.maintainUser.surname.setValue(user.admin.surname)
            await maintenance.maintainUser.forename1.setValue(user.admin.forename1)
            await maintenance.maintainUser.emailAddress.setValue(`${user.admin.username}@eor.${t2 ? 'localdomain' : 'local'}`)
            await maintenance.maintainUser.save.click()
            newUser = false
        } else {
            // New account goes to profile automatically.  Open profile if editing existing user.
            await maintenance.userProfile.goto()
            await maintenance.userProfile.providerEstablishment.setValue('<All Provider / Establishments>')
            await maintenance.userProfile.userName.setValue(user.admin.username)
            await maintenance.userProfile.surname.setValue('')
            await maintenance.userProfile.forename1.setValue('')
            await maintenance.userProfile.search.click()
            await maintenance.userProfile.userNameColumn.clickFirstRow()
        }

        await maintenance.maintainFullUserProfile.forename1.setValue(user.admin.forename1)
        await maintenance.maintainFullUserProfile.surname.setValue(user.admin.surname)
        await maintenance.maintainFullUserProfile.lau.setValueByIndex(1)
        await maintenance.maintainFullUserProfile.mainTeam.setValueByIndex(1)
        if (profile.frameworkRole != null) {
            await maintenance.maintainFullUserProfile.frameworkRole.setValue(profile.frameworkRole)
        }
        await maintenance.maintainFullUserProfile.defaultCountersigner.setValue(profile.defaultCountersigner?.lovLookup ?? '%')

        await maintenance.maintainFullUserProfile.roles.clickButton('removeall')
        await maintenance.maintainFullUserProfile.roles.addItems(profile.roles)

        await maintenance.maintainFullUserProfile.save.click()
        await maintenance.maintainFullUserProfile.close.click()

        await user.logout()
    }

})
