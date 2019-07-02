import currency from 'currency.js'

export function objectParser (obj: string): object {
  if (!obj) {
    return {}
  }
  return JSON.parse(obj)
}
export function arrayParser (list: string): any[] {
  if (!list) {
    return []
  }
  if (Array.isArray(list)) {
    return list
  }
  return JSON.parse(list)
}

export function moneyParser (num: number) {
  return currency(num).divide(100).value
}

export function dateStringParser (dateString: string = '', len: number = 10): string {
  return dateString && dateString.substring(0, len)
}
