/*
  data.js: the exercise data (gap text, solutions, additional wrong elements).
  The program (app.js) reads everything from window.AUFGABE.
  The source of this gap text is "gap-text-proposal-v5.md" (50 gaps).
*/
(function () {
  'use strict';

  // Helpers: one function per syntax colour (VS Code "Light+").
  // T = tag, A = attribute name, V = attribute value, C = comment,
  // S = CSS selector, P = CSS property, W = CSS value (word),
  // N = CSS number, X = plain text, G(n) = gap number n.
  const mk = (k) => (t) => ({ k: k, t: t });
  const T = mk('tag');
  const A = mk('attr');
  const V = mk('val');
  const C = mk('cm');
  const S = mk('sel');
  const P = mk('prop');
  const W = mk('cv');
  const N = mk('num');
  const X = mk('pl');
  const G = (n) => ({ gap: n });

  // O('th', {class: 'x'}) -> <th class="x">     Cl('th') -> </th>
  const O = (name, attrs) => [
    T('<' + name),
    ...Object.entries(attrs || {}).flatMap(([a, v]) => [T(' '), A(a), X('='), V('"' + v + '"')]),
    T('>')
  ];
  const Cl = (name) => T('</' + name + '>');
  const L = (...parts) => parts.flat();
  const I2 = X('  ');   // indentation: 2 spaces
  const I4 = X('    ');  // indentation: 4 spaces
  const I6 = X('      '); // indentation: 6 spaces

  const zeilen = [
    /*  1 */ L(T('<!DOCTYPE html>')),
    /*  2 */ L(T('<html>')),
    /*  3 */ L(T('<head>')),
    /*  4 */ L(I2, G(1), C(' Hier beginnt das Design der Seite -->')),
    /*  5 */ L(I2, T('<meta '), G(2), X('='), V('"utf-8"'), T('>')),
    /*  6 */ L(I2, T('<'), G(3), T('>'), X('Informatik-Club'), Cl('title')),
    /*  7 */ L(I2, T('<'), G(4), T('>')),
    /*  8 */ L(I4, C('/* Design für die Überschriften */')),
    /*  9 */ L(I4, G(5), S('abschnittstitel'), X(' {')),
    /* 10 */ L(I6, G(6), X(': '), W('Verdana, sans-serif'), X(';')),
    /* 11 */ L(I6, C('/* Schriftfarbe */')),
    /* 12 */ L(I6, G(7), X(': '), W('darkblue'), X(';')),
    /* 13 */ L(I6, G(8), X(': '), W('center'), X(';')),
    /* 14 */ L(I4, X('}')),
    /* 15 */ L(),
    /* 16 */ L(I4, C('/* Design für die Tabelle */')),
    /* 17 */ L(I4, S('.tabellenkopf'), X(' {')),
    /* 18 */ L(I6, C('/* Hintergrundfarbe */')),
    /* 19 */ L(I6, G(9), X(': '), W('lightgray'), X(';')),
    /* 20 */ L(I4, X('}')),
    /* 21 */ L(),
    /* 22 */ L(I4, C('/* Design für den Text */')),
    /* 23 */ L(I4, S('.einleitung'), X(' {')),
    /* 24 */ L(I6, G(10), X(': '), N('18px'), X(';')),
    /* 25 */ L(I4, X('}')),
    /* 26 */ L(I4, S('.aktivitaet'), X(' {')),
    /* 27 */ L(I6, G(11), X(': '), W('bold'), X(';')),
    /* 28 */ L(I4, X('}')),
    /* 29 */ L(I4, S('.tipp'), X(' {')),
    /* 30 */ L(I6, G(12), X(': '), W('italic'), X(';')),
    /* 31 */ L(I6, P('color'), X(': '), W('gray'), X(';')),
    /* 32 */ L(I4, X('}')),
    /* 33 */ L(I4, S('.link-ohne-linie'), X(' {')),
    /* 34 */ L(I6, G(13), X(': '), W('none'), X(';')),
    /* 35 */ L(I4, X('}')),
    /* 36 */ L(),
    /* 37 */ L(I4, C('/* Design für einzelne Elemente '), G(14)),
    /* 38 */ L(I4, G(15), S('vereinsname'), X(' {')),
    /* 39 */ L(I6, P('color'), X(': '), W('crimson'), X(';')),
    /* 40 */ L(I6, P('text-align'), X(': '), W('center'), X(';')),
    /* 41 */ L(I4, X('}')),
    /* 42 */ L(I4, S('#anmeldung'), X(' {')),
    /* 43 */ L(I6, P('background-color'), X(': '), W('lightyellow'), X(';')),
    /* 44 */ L(I4, X('}')),
    /* 45 */ L(I2, Cl('style')),
    /* 46 */ L(G(16)),
    /* 47 */ L(G(17)),
    /* 48 */ L(I2, C('<!-- Kopfbereich -->')),
    /* 49 */ L(I2, T('<'), G(18), T(' '), A('src'), X('='), V('"logo.png"'), X(' '), G(19), X('='), V('"150"'), T('>')),
    /* 50 */ L(I2, O('h1', { id: 'vereinsname' }), X('Informatik-Club'), T('</'), G(20), T('>')),
    /* 51 */ L(I2, T('<p '), G(21), X('='), V('"einleitung"'), T('>'), X('Willkommen beim '), T('<'), G(22), T('>'), X('Informatik-Club'), Cl('b'), X('! Bei uns lernst du '), O('i'), X('programmieren'), T('</'), G(23), T('>'), X(', arbeitest an '), T('<'), G(24), T('>'), X('eigenen Projekten'), Cl('u'), X(' und hast jede Menge Spaß.'), Cl('p')),
    /* 53 */ L(),
    /* 54 */ L(I2, T('<'), G(26), T(' '), A('class'), X('='), V('"abschnittstitel"'), T('>'), X('Was machen wir?'), Cl('h2')),
    /* 55 */ L(I2, T('<'), G(27), T('>')),
    /* 56 */ L(I4, O('li', { class: 'aktivitaet' }), X('Webseiten bauen'), Cl('li')),
    /* 57 */ L(I4, O('li', { class: 'aktivitaet' }), X('Spiele programmieren'), Cl('li')),
    /* 58 */ L(I4, O('li', { class: 'aktivitaet' }), X('Roboter steuern'), Cl('li')),
    /* 59 */ L(I2, Cl('ul')),
    /* 60 */ L(I2, T('<'), G(28), T('>'), X('Alle sind willkommen!'), T('<'), G(29), T('>'), X('Vorkenntnisse brauchst du keine.'), Cl('p')),
    /* 61 */ L(),
    /* 62 */ L(I2, O('h2', { class: 'abschnittstitel' }), X('Wann treffen wir uns?'), Cl('h2')),
    /* 63 */ L(I2, T('<'), G(30), T('>')),
    /* 64 */ L(I4, T('<'), G(31), T('>')),
    /* 65 */ L(I6, O('th', { class: 'tabellenkopf' }), X('Tag'), Cl('th')),
    /* 66 */ L(I6, O('th', { class: 'tabellenkopf' }), X('Uhrzeit'), Cl('th')),
    /* 67 */ L(I6, O('th', { class: 'tabellenkopf' }), X('Raum'), Cl('th')),
    /* 68 */ L(I4, Cl('tr')),
    /* 69 */ L(I4, O('tr')),
    /* 70 */ L(I6, O('td'), X('Dienstag'), Cl('td')),
    /* 71 */ L(I6, O('td'), X('15:00 Uhr'), Cl('td')),
    /* 72 */ L(I6, O('td'), X('EDV-Saal'), Cl('td')),
    /* 73 */ L(I4, Cl('tr')),
    /* 74 */ L(I4, O('tr')),
    /* 75 */ L(I6, O('td'), X('Donnerstag'), Cl('td')),
    /* 76 */ L(I6, O('td'), X('15:00 Uhr'), Cl('td')),
    /* 77 */ L(I6, O('td'), X('EDV-Saal'), Cl('td')),
    /* 78 */ L(I4, Cl('tr')),
    /* 79 */ L(I2, Cl('table')),
    /* 80 */ L(),
    /* 81 */ L(I2, T('<h2 '), G(32), X('='), V('"abschnittstitel"'), T('>'), X('So läuft ein Treffen ab'), Cl('h2')),
    /* 82 */ L(I2, O('ol')),
    /* 83 */ L(I4, O('li'), X('Begrüßung und kurze Wiederholung'), Cl('li')),
    /* 84 */ L(I4, O('li'), X('Gemeinsam ein Projekt planen'), Cl('li')),
    /* 85 */ L(I4, O('li'), X('Programmieren in Teams'), Cl('li')),
    /* 86 */ L(I4, O('li'), X('Ergebnisse vorstellen'), Cl('li')),
    /* 87 */ L(I2, T('</'), G(33), T('>')),
    /* 88 */ L(I2, C('<!-- Das Wort "Laptop" bekommt eine rote Schriftfarbe -->')),
    /* 89 */ L(I2, T('<'), G(34), T(' '), A('class'), X('='), V('"tipp"'), T('>'), X('Tipp: Vergiss deinen '), T('<'), G(35), T(' '), A('style'), X('='), V('"'), G(36), X(': '), W('red'), X(';'), V('"'), T('>'), X('Laptop'), Cl('span'), X(' nicht!'), Cl('h3')),
    /* 90 */ L(),
    /* 91 */ L(I2, O('h2', { class: 'abschnittstitel' }), X('Unser Projektvideo'), Cl('h2')),
    /* 92 */ L(I2, T('<p '), A('style'), X('='), V('"'), G(37), X(': '), W('center'), X(';'), V('"'), T('>')),
    /* 93 */ L(I4, T('<iframe '), G(38), X('='), V('"https://www.youtube.com/embed/VIDEO-ID"'), T(' '), A('width'), X('='), V('"420"'), T(' '), A('height'), X('='), V('"236"'), T('></'), G(39), T('>')),
    /* 94 */ L(I2, Cl('p')),
    /* 95 */ L(I2, T('<p>'), X('Mehr über Informatik findest du '), T('<a '), A('class'), X('='), V('"link-ohne-linie"'), T(' '), G(40), X('='), V('"https://de.wikipedia.org/wiki/Informatik"'), T('>'), X('hier'), T('</'), G(41), T('>'), X('.'), Cl('p')),
    /* 96 */ L(I2, O('hr')),
    /* 97 */ L(),
    /* 98 */ L(I2, O('h2', { class: 'abschnittstitel' }), X('Mitmachen'), Cl('h2')),
    /* 99 */ L(I2, T('<'), G(42), T(' '), G(43), X('='), V('"anmeldung"'), T('>')),
    /* 100 */ L(I4, T('<'), G(44), T(' '), A('type'), X('='), V('"text"'), T(' '), A('placeholder'), X('='), V('"Dein Name"'), T('>'), O('br')),
    /* 101 */ L(I4, T('<input '), A('type'), X('='), V('"'), G(45), V('"'), T(' '), G(46), X('='), V('"Deine E-Mail-Adresse"'), T('>'), O('br')),
    /* 102 */ L(I4, O('input', { type: 'number', placeholder: 'Schulstufe' }), O('br')),
    /* 103 */ L(I4, X('Geburtstag: '), T('<input '), G(47), X('='), V('"date"'), T('>'), O('br')),
    /* 104 */ L(I4, O('input', { type: 'tel', placeholder: 'Telefonnummer der Erziehungsberechtigten' }), O('br')),
    /* 105 */ L(I4, T('<input '), A('type'), X('='), V('"'), G(48), V('"'), T('>'), X(' Ich habe die Regeln des Informatik-Clubs gelesen.'), O('br')),
    /* 106 */ L(I4, T('<'), G(49), T('>'), X('Anmelden'), Cl('button')),
    /* 107 */ L(I2, Cl('form')),
    /* 108 */ L(T('</body>')),
    /* 109 */ L(G(50))
  ];

  // Accepted answers per gap. The first entry is the element that belongs to the gap.
  // Gaps with the same answer are interchangeable (checked by the element text).
  // Gap 19 accepts "width" or "height".
  const luecken = {
    1: ['<!--'], 2: ['charset'], 3: ['title'], 4: ['style'], 5: ['.'],
    6: ['font-family'], 7: ['color'], 8: ['text-align'], 9: ['background-color'],
    10: ['font-size'], 11: ['font-weight'], 12: ['font-style'], 13: ['text-decoration'],
    14: ['*/'], 15: ['#'], 16: ['</head>'], 17: ['<body>'], 18: ['img'],
    19: ['width', 'height'], 20: ['h1'], 21: ['class'], 22: ['b'], 23: ['i'],
    24: ['u'], 26: ['h2'], 27: ['ul'], 28: ['p'], 29: ['br'],
    30: ['table'], 31: ['tr'], 32: ['class'], 33: ['ol'], 34: ['h3'], 35: ['span'],
    36: ['color'], 37: ['text-align'], 38: ['src'], 39: ['iframe'], 40: ['href'],
    41: ['a'], 42: ['form'], 43: ['id'], 44: ['input'], 45: ['email'],
    46: ['placeholder'], 47: ['type'], 48: ['checkbox'], 49: ['button'], 50: ['</html>']
  };

  // Additional elements that are not part of the solution
  // ("height" is also accepted in gap 19).
  const zusatzElemente = [
    'height', 'font-color', 'div', 'strong', 'h4', 'hr', 'link', 'name', '<html>', '<head>'
  ];

  window.AUFGABE = { zeilen: zeilen, luecken: luecken, zusatzElemente: zusatzElemente };
})();
