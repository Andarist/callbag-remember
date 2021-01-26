import { Source } from 'callbag';

export default function remember<T>(source: Source<T>): Source<T>;