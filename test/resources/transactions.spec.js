'use strict'

const sdk = require('../../src/sdk.js')
const mockApi = require('../mock/api.js')
require('should')

describe('Zabo SDK Transactions Resource', () => {
  let transactions

  it('should be instantiated during zabo.init()', async function () {
    await sdk.init({
      apiKey: 'some-api-key',
      secretKey: 'some-secret-key',
      env: 'sandbox',
      autoConnect: false
    }).catch(err => err).should.be.ok()

    sdk.api.should.be.ok()
    sdk.api.connect.should.be.a.Function()

    sdk.api.resources.should.have.property('transactions')

    transactions = await require('../../src/resources/transactions')(mockApi)

    transactions.should.have.property('getOne')
    transactions.should.have.property('getList')
    transactions.should.have.property('send')
  })

  it('transactions.getOne() should fail if `userId` is not provided', async function () {
    const response = await transactions.getOne({
      accountId: '7a1e6a76-f7d0-4b8c-8c16-8972041c970a',
      txId: 'b2a020df-1057-4847-8aaf-eb1f524e3518'
    }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('userId')
  })

  it('transactions.getOne() should fail if `accountId` is not provided', async function () {
    const response = await transactions.getOne({
      userId: '35b6b5dd-90a4-478e-b7b4-8712370f3333',
      txId: 'b2a020df-1057-4847-8aaf-eb1f524e3518'
    }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('accountId')
  })

  it('transactions.getOne() should fail if `txId` is not provided', async function () {
    const response = await transactions.getOne({
      userId: '35b6b5dd-90a4-478e-b7b4-8712370f3333',
      accountId: '7a1e6a76-f7d0-4b8c-8c16-8972041c970a'
    }).should.be.rejected()

    response.should.be.an.Error()
    response.error_type.should.be.equal(400)
    response.message.should.containEql('txId')
  })

  it('transactions.getList() should fail if `userId` is not provided', async function () {
    const response = await transactions.getList({
      accountId: '7a1e6a76-f7d0-4b8c-8c16-8972041c970a',
      currency: 'ETH',
      limit: 10
    }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('userId')
  })

  it('transactions.getList() should fail if `accountId` is not provided', async function () {
    const response = await transactions.getList({
      userId: '35b6b5dd-90a4-478e-b7b4-8712370f3333',
      currency: 'ETH',
      limit: 10
    }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('accountId')
  })

  it('transactions.getList() should fail if an invalid `limit` is provided', async function () {
    const response = await transactions.getList({ limit: 51 }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('limit')
  })

  it('transactions.getList() should fail if an invalid `cursor` is provided', async function () {
    const response = await transactions.getList({ cursor: 'not_a_valid_timestamp' }).should.be.rejected()

    response.should.be.an.Error()

    response.error_type.should.be.equal(400)
    response.message.should.containEql('cursor')
  })

  it('transactions.getList() should return the list of transactions', async function () {
    const data = {
      userId: '35b6b5dd-90a4-478e-b7b4-8712370f3333',
      accountId: 'ff0dc466-547b-45f6-a34c-f45463489e2f'
    }
    const list = await transactions.getList(data)

    list.should.be.ok()
    list.data.should.be.an.Array()
    list.data[0].should.have.properties(['id', 'type', 'currency', 'amount', 'status', 'other_parties', 'initiated_at', 'confirmed_at'])
  })

  it('transactions.getOne() should return one transaction', async function () {
    const data = {
      userId: '35b6b5dd-90a4-478e-b7b4-8712370f3333',
      accountId: 'ff0dc466-547b-45f6-a34c-f45463489e2f',
      txId: 'a34681a8917b60202e0a30383162f6c54d397a3372d81b9d653f17ce05a40739'
    }
    const tx = await transactions.getOne(data)

    tx.should.be.ok()
    tx.should.have.properties(['id', 'type', 'currency', 'amount', 'status', 'other_parties', 'initiated_at', 'confirmed_at'])
    tx.id.should.be.eql(data.txId)
  })
})
