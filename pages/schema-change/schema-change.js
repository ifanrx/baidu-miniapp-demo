import {showSuccessToast, showFailToast, showModalText} from '../../utils/interface-feedback'
import {SCHEMA_TABLE, SCHEMA_TABLE_POINTER_COLUMN, POINTER_TABLE, BAAS_ERROR_CODE, getPointerIds} from '../../utils/constant'

import deepEql from '../../vendor/deep-eql'

const app = getApp()

let Table
let pointer_ids = {}

const valueGenerator = {
  string() {
    return Math.random().toString(36).substring(2, 8)
  },
  integer() {
    return Math.round(Math.random() * 100)
  },
  number() {
    return Math.random() * 100
  },
  boolean() {
    return Math.random() > 0.5
  },
  array_string() {
    return [this.string(), this.string()]
  },
  array_integer() {
    return [this.integer(), this.integer()]
  },
  array_number() {
    return [this.number(), this.number()]
  },
  array_boolean() {
    return [this.boolean(), this.boolean()]
  },
  date() {
    return ((new Date()).toISOString()).toString()
  },
  polygon() {
    return new app.BaaS.GeoPolygon([[10.123, 10], [20.12453, 10], [30.564654, 20], [20.654, 30], [10.123, 10]])
  },
  point() {
    return new app.BaaS.GeoPoint(10.123, 8.543)
  },
}

let object = { "a": "b", "c": ["d", "array", "dog"], "f": { "f": 123.44 } }

Page({
  data: {
    record: null,
  },

  onLoad: function() {
    Table = new app.BaaS.TableObject(SCHEMA_TABLE)
    pointer_ids = getPointerIds()
  },

  checkRecordFieldEql(key, optionValue, recordDataValue) {
    const check = () => {
      if (key === 'date') {
        return new Date(optionValue).getTime() === new Date(recordDataValue).getTime()
      } else if (key == 'geo_point' || key == 'geo_polygon') {
        return deepEql(optionValue.geoJSON, recordDataValue)
      } else if (key == 'file') {
        console.warn('暂时无法检测返回的 file 数据是否是用户设置的数据')
        return !!recordDataValue
      } else if (key.includes('pointer')) {
        return !!recordDataValue
      } else if (key == 'array_geo' || key == 'array_file' || key == 'array_obj') {
        return !!recordDataValue
      }
      console.log('key', key, optionValue, recordDataValue)
      return deepEql(optionValue, recordDataValue)
    }
    if (check()) {
      return true
    } else {
      console.error(`'${JSON.stringify(optionValue)}' not equal to '${JSON.stringify(recordDataValue)}'`)
      return false
    }
  },

  createRecord: function() {
    let record = Table.create()
    console.log(2222)
    let options = {
      str: valueGenerator.string(),
      int: valueGenerator.integer(),
      num: valueGenerator.number(),
      boo: valueGenerator.boolean(),
      array_i: valueGenerator.array_integer(),
      array_n: valueGenerator.array_number(),
      array_b: valueGenerator.array_boolean(),
      array_s: valueGenerator.array_string(),
      date: valueGenerator.date(),
      geo_polygon: valueGenerator.polygon(),
      geo_point: valueGenerator.point(),
      obj: object,
      [SCHEMA_TABLE_POINTER_COLUMN]: new app.BaaS.TableObject(POINTER_TABLE).getWithoutData(pointer_ids.pointer_id),
      array_obj: [object, object],
      array_geo: [valueGenerator.point(), valueGenerator.polygon()],
      array_file: []
    }
    console.log(33333)
    record.set(options)
    record.set(options)
    record.save()
        .then(res => {
          console.log('res', options, res.data)
          showSuccessToast('新增成功')
          this.setData({
            record: res.data
          })
        })
        .catch(err => {
          console.dir(err)
          if (err.code === BAAS_ERROR_CODE.USER_UNAUTHORIZED) {
            showFailToast('请登录后操作')
          } else {
            showModalText(err.message)
          }
        })
  },

  deleteRecord: function() {
    Table.delete(this.data.record.id).then(res => {
      showSuccessToast()
      this.setData({
        record: null,
      })
    }, err => {
      showFailToast()
    })
  },

  updateRecord: function() {
    let record = Table.getWithoutData(this.data.record.id)
    const key = 'int'
    const value = 100
    record.set(key, value)
    record.update().then(res => {
      if (!this.checkRecordFieldEql(key, value, res.data[key])) {
        throw new Error()
      }
      showSuccessToast()
      this.setData({
        record: res.data
      })
    }, err => {
      showFailToast()
    })
  },

  increment(key, value) {
    Table.getWithoutData(this.data.record.id).incrementBy(key, value).update().then(res => {
      this.checkRecordFieldEql(key, this.data.record.int + value, res.data[key])
      this.setData({
        record: res.data
      })
      showSuccessToast()
    }, err => {
      showFailToast()
    })
  },

  minusOne: function() {
    this.increment('int', -1)
  },

  plusOne: function() {
    this.increment('int', 1)
  },

  addItemToArray(key, value) {
    if (!Array.isArray(value)) {
      value = [value]
    }
    return Table.getWithoutData(this.data.record.id).append(key, value).update().then(res => {
      if (!this.checkRecordFieldEql(key, this.data.record[key].concat(value), res.data[key])) {
        throw new Error()
      }
      this.setData({
        record: res.data
      })
      showSuccessToast()
    }, err => {
      showFailToast()
    })

  },

  addItem: function(event) {
    const value = event.currentTarget.dataset.value
    this.addItemToArray('array_i', value)
  },

  removeArrayFromArray(key, value) {
    if (!Array.isArray(value)) {
      value = [value]
    }
    const optionValue = this.data.record.array_i.filter(item => value.indexOf(item) === -1)
    return Table.getWithoutData(this.data.record.id).remove(key, value).update().then(res => {
      if (!this.checkRecordFieldEql(key, optionValue, res.data[key])) {
        throw new Error()
      }
      this.setData({
        record: res.data
      })
      showSuccessToast()
    }, err => {
      showFailToast()
    })
  },

  removeItem: function(event) {
    const value = event.currentTarget.dataset.value
    this.removeArrayFromArray('array_i', value)
  },

  // 添加行，包括所有列类型
  addRow: function() {
    let AllType = new app.BaaS.TableObject('test_all_types')
    let allType = AllType.create()
    let string_v = Math.random().toString(36).substring(2, 8)
    let integer_v = Math.round(Math.random() * 100)
    let number_v = Math.random() * 100
    let boolean_v = true
    let array_string_v = [Math.random().toString(36).substring(2, 8), Math.random().toString(36).substring(2, 8)]
    let array_integer_v = [Math.round(Math.random() * 100), Math.round(Math.random() * 100)]
    let array_number_v = [Math.random() * 100, Math.random() * 100]
    let array_boolean_v = [true, false]
    let date_v = ((new Date()).toISOString()).toString()
    var polygon = new app.BaaS.GeoPolygon([[10, 10], [20, 10], [30, 20], [10, 10]])
    var point = new app.BaaS.GeoPoint(10, 10)

    allType.set('col_string', string_v)
    allType.set('col_integer', integer_v)
    allType.set('col_number', number_v)
    allType.set('col_boolean', boolean_v)
    allType.set('array_string', array_string_v)
    allType.set('array_integer', array_integer_v)
    allType.set('array_number', array_number_v)
    allType.set('array_boolean', array_boolean_v)
    allType.set('col_date', date_v)
    allType.set('geojson_earth', polygon)
    allType.set('geojson_mars', point)

    allType.save().then(res => {
      showSuccessToast()
    }, err => {
      showFailToast()
    })
  },

  SetAtLast: function() {
    let record = Table.getWithoutData(this.data.record.id)
    record.remove('array_i', 110)
    record.append('array_i', 100000)
    record.set('array_i', [123])
    record.update().then(res => {
      showSuccessToast()
    }, err => {
      showFailToast()
    })
  },

  appendAtLast: function() {
    let record = Table.getWithoutData(this.data.record.id)
    record.set('array_i', [123])
    record.remove('array_i', 110)
    record.append('array_i', 100000)
    record.update().then(res => {
      showSuccessToast()
    }, err => {
      showFailToast()
    })
  },

  patchObject() {
    let record = Table.getWithoutData(this.data.record.id)
    record.patchObject('obj', { num: Math.ceil(Math.random() * 1000) })
    record.update().then(res => {
      this.setData({
        record: res.data
      })
      showSuccessToast()
    }, err => {
      showFailToast()
    })
  },

  updatePointer() {
    // 获取一个 tableRecord 实例
    let Order = new app.BaaS.TableObject(POINTER_TABLE)

    let order = Order.getWithoutData(pointer_ids.pointer_id2)

    // 创建一行数据
    let product = Table.getWithoutData(this.data.record.id)

    // 给 pointer 字段赋值
    product.set(SCHEMA_TABLE_POINTER_COLUMN, order)

    product.update().then(res => {
      showSuccessToast()
      console.log(res)
    })

  },

  unsetUseStrParam() {
    let record = Table.getWithoutData(this.data.record.id)
    let randomNum = Math.random()

    record.set('num', randomNum)
    record.unset('array_obj')
    record.unset('array_file')
    record.unset('array_geo')

    record.update().then(res => {
      this.setData({
        record: res.data
      })
      if (res.data.num == randomNum &&
        res.data.array_obj === undefined &&
        res.data.array_file === undefined &&
        res.data.array_geo === undefined) {
        showSuccessToast()
      } else {
        throw new Error('fail')
      }
    }).catch(err => {
      console.log(err)
      showFailToast()
    })
  },

  unsetUseObjParam() {
    let record = Table.getWithoutData(this.data.record.id)
    let randomNum = Math.random()

    record.set({
      num: randomNum,
    })
    record.unset({
      array_obj: 'abc',
      array_file: { a: 10 },
      array_geo: true,
    })

    record.update().then(res => {
      this.setData({
        record: res.data
      })
      if (res.data.num == randomNum &&
        res.data.array_obj === undefined &&
        res.data.array_file === undefined &&
        res.data.array_geo === undefined) {
        showSuccessToast()
      } else {
        throw new Error('fail')
      }
    }).catch(err => {
      console.log(err)
      showFailToast()
    })
  }
})
