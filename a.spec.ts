import { describe, it, test, expect } from "vitest";
import {
  combination,
  fastPow,
  ProbMatrix,
  calcProbsToGetWantedUnitByOneReroll,
  calcProbToBeShownExactNumOfTheCostUnits,
  calcProbToHitExactNumberFromBag,
  calcProbMatrixToGetWantedUnitByOneReroll,
  calcProbsToGetWantedUnitByKRerolls,
} from "./a";

describe("combination", () => {
  test("1", () => {
    expect(combination(1, 2)).toBe(0);
  });
  test("2", () => {
    expect(combination(5, 2)).toBe(10);
  });
  test("3", () => {
    expect(combination(3, 2)).toBe(3);
  });
  test("4", () => {
    expect(combination(100, 0)).toBe(1);
  });
});
describe("calcProbToHitExactNumberFromBag", () => {
  test("1", () => {
    expect(calcProbToHitExactNumberFromBag(1, 1, 2, 5)).toBeCloseTo(0.4);
  });
});
describe("calcProbToBeShownExactNumOfTheCostUnits", () => {
  test("1", () => {
    expect(calcProbToBeShownExactNumOfTheCostUnits(1 / 3, 2)).toBeCloseTo(
      80 / 243
    );
  });
  test("2", () => {
    expect(calcProbToBeShownExactNumOfTheCostUnits(0.9, 0)).toBeCloseTo(
      0.00001
    );
  });
});
describe("calcProbsToGetWantedUnitByOneReroll", () => {
  test("普通のケース", () => {
    const tested = calcProbsToGetWantedUnitByOneReroll(0.4, 18, 234);
    expect(tested[0]).toBeCloseTo(0.85488918);
    expect(tested[1]).toBeCloseTo(0.1366168);
    expect(tested[2]).toBeCloseTo(0.00825584);
    expect(tested[3]).toBeCloseTo(0.00390052);
    expect(tested[4]).toBeCloseTo(0.000003138816, 5);
    expect(tested[5]).toBeCloseTo(0.0000000156661, 8);
    expect(
      tested.map((prob, i) => prob * i).reduce((a, b) => a + b)
    ).toBeCloseTo((18 / 234) * 0.4 * 5);
  });
  test("もうないケース", () => {
    const tested = calcProbsToGetWantedUnitByOneReroll(0.4, 0, 234);
    expect(tested[0]).toBeCloseTo(1);
    expect(tested[1]).toBeCloseTo(0);
    expect(tested[2]).toBeCloseTo(0);
    expect(tested[3]).toBeCloseTo(0);
    expect(tested[4]).toBeCloseTo(0);
    expect(tested[5]).toBeCloseTo(0);
  });
  test("確定ドロップ", () => {
    const tested = calcProbsToGetWantedUnitByOneReroll(1, 100, 2000);
    expect(tested[0]).toBeCloseTo(0.773577, 6);
    expect(tested[1]).toBeCloseTo(0.204002, 6);
    expect(tested[2]).toBeCloseTo(0.021293, 6);
    expect(tested[3]).toBeCloseTo(0.0010994, 7);
    expect(tested[4]).toBeCloseTo(0.0000281, 7);
    expect(tested[5]).toBeCloseTo(0.00000028, 8);
  });
});
describe("fastPow", () => {
  test("普通のテスト", () => {
    expect(fastPow(2, 10n, (a, b) => a * b)).toBe(1024);
    expect(fastPow(3, 5n, (a, b) => a * b)).toBe(243);
    expect(fastPow("a", 4n, (a, b) => a + b)).toBe("aaaa");
    expect(fastPow(1.2, 1n, (a, b) => a * b)).toBe(1.2);
  });
  test("大きい指数", () => {
    expect(fastPow(4, 1000000000n, (a, b) => a + b)).toBe(4000000000);
  });
});
describe("ProbMatrix", () => {
  test("print works", () => {
    const tested = new ProbMatrix();
    tested.val[0][1] = 1;
    const expected = `0 1 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0`;
    expect(tested.print()).toBe(expected);
  });
});
describe("calcProbMatrixToGetWantedUnitByOneReroll", () => {
  test("calc correct prob matrix", () => {
    const tested = calcProbMatrixToGetWantedUnitByOneReroll(0.4, 18, 234);
    const expected = `0.85 0.14 0.0083 0.00024 0.0000031 1.6e-8 0.0 0.0 0.0 0.0
0.0 0.86 0.13 0.0074 0.00020 0.0000025 1.2e-8 0.0 0.0 0.0
0.0 0.0 0.87 0.12 0.0067 0.00017 0.0000019 8.3e-9 0.0 0.0
0.0 0.0 0.0 0.88 0.12 0.0059 0.00014 0.0000015 5.9e-9 0.0
0.0 0.0 0.0 0.0 0.88 0.11 0.0052 0.00011 0.0000011 4.0e-9
0.0 0.0 0.0 0.0 0.0 0.89 0.10 0.0045 0.000089 8.1e-7
0.0 0.0 0.0 0.0 0.0 0.0 0.90 0.097 0.0039 0.000071
0.0 0.0 0.0 0.0 0.0 0.0 0.0 0.91 0.090 0.0033
0.0 0.0 0.0 0.0 0.0 0.0 0.0 0.0 0.91 0.086
0.0 0.0 0.0 0.0 0.0 0.0 0.0 0.0 0.0 1.0`;
    expect(tested.print(2)).toBe(expected);
  });
});
describe("calcProbsToGetWantedUnitByKRerolls", () => {
  test("普通のケース", () => {
    const tested = calcProbsToGetWantedUnitByKRerolls(0.4, 18, 234, 30n);

    expect(tested[0]).toBeCloseTo(0.0090634750718);
    expect(tested[1]).toBeCloseTo(0.04905593744956753);
    expect(tested[2]).toBeCloseTo(0.1249433379406277);
    expect(tested[3]).toBeCloseTo(0.19896558404068698);
    expect(tested[4]).toBeCloseTo(0.22198514760374152);
    expect(tested[5]).toBeCloseTo(0.18425954499694594);
    expect(tested[6]).toBeCloseTo(0.11792015803588558);
    expect(tested[7]).toBeCloseTo(0.05948937906440427);
    expect(tested[8]).toBeCloseTo(0.023982618075858903);
    expect(tested[9]).toBeCloseTo(0.010334817720456906);
  });
  test("can calc very fast", () => {
    const tested = calcProbsToGetWantedUnitByKRerolls(0.4, 18, 234, 10000n);

    expect(tested).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, expect.closeTo(1)]);
  });
  test("zero reroll", () => {
    const tested = calcProbsToGetWantedUnitByKRerolls(0.4, 18, 234, 0n);

    expect(tested).toEqual([1, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });
});
