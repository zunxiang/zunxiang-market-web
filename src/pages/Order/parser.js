import { arrayParser, dateStringParser, objectParser } from '@/utils/parser';

export default function orderParer(o) {
  return {
    ...o,
    package: objectParser(o.package),
    fee_details: arrayParser(o.fee_details),
    skus: arrayParser(o.skus),
    travellers: arrayParser(o.travellers),
    create_time: dateStringParser(o.create_time, 19),
    finish_time: dateStringParser(o.finish_time, 19),
    start_time: dateStringParser(o.start_time),
    end_time: dateStringParser(o.end_time),
  };
}
