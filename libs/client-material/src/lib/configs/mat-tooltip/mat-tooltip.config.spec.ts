import { matTooltipOptionsFactory } from './mat-tooltip.config';

describe('mat-tooltip config', () => {
  it('matTooltipOptionsFactory should return expected options', () => {
    const options = matTooltipOptionsFactory();
    const expected = {
      showDelay: 100,
      hideDelay: 100,
      touchendHideDelay: 1000,
    };
    expect(options).toMatchObject(expected);
  });
});
