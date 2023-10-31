/* eslint-disable import/no-extraneous-dependencies */
import { range } from 'lodash';

import stripDiacritics from './stripDiacritics';

describe('stripDiacritics', () => {
  it('removes accents and other diacritical marks from a string', () => {
    const string =
      'ÆÐƎƐŒẞæǝɛœſßĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯƳąɓçđɗęħįƙłøơşșţțŧųưƴÁÀÂÄǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƐĠĜǦĞĢáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗéèėêëěĕēęẹġĝǧğģĤḤĦIÍÌİÎÏǏĬĪĨĮỊĴĶƘĹĻŁĽĿNŃŇÑŅÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĵķƙĸĺļłľŀŉńňñņóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝšşșṣßťţṭŧúùûüǔŭūũűůųụưẃẁŵẅýỳŷÿȳỹƴźżžẓ';
    const result =
      'AEDEEOESaeeeoelsABCDDEHIKLOOSSTTTUUYabcddehikloosstttuuyAAAAAAAAAAAAEAEAEBCCCCCDDDDDEEEEEEEEEEEEGGGGGaaaaaaaaaaaaeaeaebcccccddddeeeeeeeeeegggggHHHIIIIIIIIIIIIJKKLLLLLNNNNNOOOOOOOOOOOOOOEhhhiiiiiiiiiiiijkkĸlllllnnnnnooooooooooooooeRRRSSSSSSSTTTTUUUUUUUUUUUUUWWWWYYYYYYYZZZZrrrlsssssssttttuuuuuuuuuuuuuwwwwyyyyyyyzzzz';

    expect(stripDiacritics(string)).toBe(result);
  });

  it('works for non-latin alphabets', () => {
    const string = 'ΆΈΉΊΪΌΎΫΏάέίϊΐόύϋΰ';
    const result = 'ΑΕΗΙΙΟΥΥΩαειιιουυυ';

    expect(stripDiacritics(string)).toBe(result);
  });

  it('removes combining diacritical marks from a string', () => {
    const alphaRange = ['a', 'b', 'c', 'd', 'e', 'f'];
    const numRange = range(30, 37);

    const arr: string[] = [];

    numRange.forEach((n) => {
      alphaRange.forEach((a) => {
        arr.push(n + a);
      });
    });

    // Build up a string of every unicode combining mark (\u0300-\u036F).
    const str = arr
      .concat(range(300, 370).map((num) => num.toString()))
      .map((n) => String.fromCharCode(Number(`0x0${n}`)))
      .join('');

    expect(str.length).toBe(112);
    expect(stripDiacritics(str)).toBe('');
  });

  it('removes combining marks from Japanese characters', () => {
    expect(stripDiacritics('ネバダ州')).toBe('ネハタ州');
  });
});
