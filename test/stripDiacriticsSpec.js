import {expect} from 'chai';

import stripDiacritics from '../src/utils/stripDiacritics';

describe('stripDiacritics', () => {

  it('removes accents and other diacritical marks from a string', () => {
    const string = 'ÆÐƎƐŒẞæǝɛœſßĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯƳąɓçđɗęħįƙłøơşșţțŧųưƴÁÀÂÄǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƐĠĜǦĞĢáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗéèėêëěĕēęẹġĝǧğģĤḤĦIÍÌİÎÏǏĬĪĨĮỊĴĶƘĹĻŁĽĿNŃŇÑŅÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĵķƙĸĺļłľŀŉńňñņóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝšşșṣßťţṭŧúùûüǔŭūũűůųụưẃẁŵẅýỳŷÿȳỹƴźżžẓ';
    const result = 'AEDEEOESaeeeoelsABCDDEHIKLOOSSTTTUUYabcddehikloosstttuuyAAAAAAAAAAAAEAEAEBCCCCCDDDDDEEEEEEEEEEEEGGGGGaaaaaaaaaaaaeaeaebcccccddddeeeeeeeeeegggggHHHIIIIIIIIIIIIJKKLLLLLNNNNNOOOOOOOOOOOOOOEhhhiiiiiiiiiiiijkkĸlllllnnnnnooooooooooooooeRRRSSSSSSSTTTTUUUUUUUUUUUUUWWWWYYYYYYYZZZZrrrlsssssssttttuuuuuuuuuuuuuwwwwyyyyyyyzzzz';

    expect(stripDiacritics(string)).to.equal(result);
  });

});
