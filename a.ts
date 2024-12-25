function assert(condition: boolean, msg: string = "Invalid Argument") {
  if (!condition) throw new Error(msg);
}

// In this case, n and k is very small.
export function combination(n: number, k: number) {
  if (n < k) return 0;
  if (n < 0) return 0;
  if (k < 0) return 0;
  let ret = 1;
  for (let i = 0; i < k; i++) {
    ret *= (n - i) / (k - i);
  }
  return ret;
}
// numOfHitsInBag個の当たり入りのサイズがbagSizeのバッグの中からpicksize個取り出して、ちょうどscore個当たりを引く確率
export function calcProbToHitExactNumberFromBag(
  score: number,
  pickSize: number,
  numOfHitsInBag: number,
  bagSize: number
) {
  const k = pickSize;
  const l = score;
  const b = bagSize;
  const a = numOfHitsInBag;

  let prob = 1;
  for (let i = 0; i < k; i++) {
    if (i < l) prob *= (a - i) / (b - i);
    else prob *= (b - a - (i - l)) / (b - i);
  }
  return combination(k, l) * prob;
}
// 排出率がrateのコストの駒がnumOfResult個だけショップに並ぶ確率
export function calcProbToBeShownExactNumOfTheCostUnits(
  rate: number,
  numOfResult: number
) {
  return (
    combination(5, numOfResult) *
    Math.pow(rate, numOfResult) *
    Math.pow(1 - rate, 5 - numOfResult)
  );
}
// [0, 1, .. , a-1] or [a, a+1, .. , b-1] (a<b)
function rep(a: number, b?: number) {
  if (b === undefined) return rep(0, a);
  let ret = new Array<number>(b - a);
  for (let i = a; i < b; i++) ret[i - a] = i;
  return ret;
}

// return valueのi番目の要素 欲しい駒を一回のリロールでi個手に入れる確率（個数別）
// (欲しい駒のコストをn Costと呼ぶ)
export function calcProbsToGetWantedUnitByOneReroll(
  rate: number,
  numOfHitsInBag: number,
  bagSize: number
): number[] {
  const probsToGetNCostUnit = rep(6).map((i) =>
    calcProbToBeShownExactNumOfTheCostUnits(rate, i)
  );
  const retArr = [0, 0, 0, 0, 0, 0];
  rep(6).forEach((result) => {
    rep(result, 6).forEach((numOfNCostUnitsInShop) => {
      retArr[result] +=
        calcProbToHitExactNumberFromBag(
          result,
          numOfNCostUnitsInShop,
          numOfHitsInBag,
          bagSize
        ) * probsToGetNCostUnit[numOfNCostUnitsInShop];
    });
  });

  return retArr;
}

// 指数が正の整数の累乗 O(log(exponent)) 時間で計算できる
export function fastPow<T>(base: T, exponent: bigint, mul: (a: T, b: T) => T) {
  assert(exponent >= 1n);
  if (exponent === 1n) return base;
  const half = fastPow(base, exponent / 2n, mul);
  if (exponent % 2n === 0n) {
    return mul(half, half);
  } else {
    return mul(mul(half, half), base);
  }
}

// i個からj個に遷移する確率を表す行列
export class ProbMatrix {
  static readonly SIZE = 10;
  val = rep(ProbMatrix.SIZE).map(() => new Array(ProbMatrix.SIZE).fill(0));
  print(precision?: number): string {
    const format =
      precision !== undefined
        ? (num: number) => num.toPrecision(precision)
        : (num: number) => String(num);
    return rep(ProbMatrix.SIZE)
      .map((i) =>
        rep(ProbMatrix.SIZE)
          .map((j) => format(this.val[i][j]))
          .join(" ")
      )
      .join("\n");
  }
  static mul(a: ProbMatrix, b: ProbMatrix): ProbMatrix {
    const ret = new ProbMatrix();
    for (let i = 0; i < ProbMatrix.SIZE; i++)
      for (let j = 0; j < ProbMatrix.SIZE; j++)
        for (let k = 0; k < ProbMatrix.SIZE; k++)
          ret.val[i][j] += a.val[i][k] * b.val[k][j];
    return ret;
  }
}

// 1回リロールしたときに駒数がどう遷移するかのMatrixを計算
export function calcProbMatrixToGetWantedUnitByOneReroll(
  rate: number,
  numOfHitsInBag: number,
  bagSize: number
): ProbMatrix {
  const ret = new ProbMatrix();
  for (let i = 0; i <= 9; i++) {
    const probs = calcProbsToGetWantedUnitByOneReroll(
      rate,
      numOfHitsInBag - i,
      bagSize - i
    );
    probs.forEach((prob, step) => {
      const j = Math.min(i + step, 9);
      ret.val[i][j] += prob;
    });
  }
  return ret;
}

// 配列のi要素目 rerollCount回リロールしたときにi個獲得できる確率
export function calcProbsToGetWantedUnitByKRerolls(
  rate: number,
  numOfHitsInBag: number,
  bagSize: number,
  rerollCount: bigint
): number[] {
  if (rerollCount === 0n) {
    return [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
  const matForKRerolls = fastPow(
    calcProbMatrixToGetWantedUnitByOneReroll(rate, numOfHitsInBag, bagSize),
    rerollCount,
    ProbMatrix.mul
  );
  let ret = new Array<number>(10).fill(0);
  for (let i = 0; i < 10; i++) ret[i] = matForKRerolls.val[0][i];
  return ret;
}
