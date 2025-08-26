const {default: MdevCloudClient} = require('./dist/index')

const mdc = new MdevCloudClient({
    db_key: 'admin',
    host: 'http://localhost:3000'
})


async function main() {
    await mdc.init({
        showRequest: false
    })

    const r = await mdc.onUpdateClient('jid-admin1', {
        isPremium: true,
        money: 0
    })
    console.log(r)
}

main()