/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem, LocationData } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'honest-burger',
    name: 'The Honest Burger',
    description: 'Double prime beef, aged cheddar, unassuming secret sauce, and vine-ripened tomatoes on a toasted brioche bun.',
    price: 12.50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBio0d_L51Fu0BHBy2JCHtkispPOlrOOnbVHIaphukQjZEo8wFXqAu2hg2bQZMl2gOo57bMtMF12KpvFlh8cc0ph-iNvy6NBRPOyZEKxZcBk6EsQBYof_6Pl7hi9YZezSs2Lh2Pa7T597rvMNJWtM5DxJlqxIoapatE8DKLM1ztyhemyM6ui_SB-WRNvgSBSynuePlcgK8USsiYqS5d2RZ57TENfCGK0FtON3TkX5u_A9WH6IugSklEPzykGDgTV_ou-rgOMGq91Eel',
    category: 'burgers',
    isBestSeller: true,
    calories: 620,
    tags: ['Double Beef', 'Real Cheese']
  },
  {
    id: 'signature-unassuming',
    name: 'Signature Unassuming Burger',
    description: 'Two quarter-pound patties of grass-fed beef, flame-grilled to order. Minimalist toppings of aged white cheddar, hand-sliced pickles, and our house-made radical honesty sauce on a toasted artisan bun.',
    price: 14.50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnHWJU4q05xtrKbXbsYpNKrO1W6QKg-aIUHC-omZ6QDOqErCFDdoCFw0MiY7JuZe42DW3Jjdqo3M3DO1f8wivuEfZpr4oaFzfwSmAy_Rab963GXashVzzqx0TAclXcW_xIPkrbu5MIEoUtSzoUKVGGm0HLx0fbtH893lxxDvdAP8ZAA15xnDicftcCCtn_8DtwRhFyOUYsU352Xfvz8N-6gjZSpQWnhlKBej3ZfHOqd5CC1oNZuFjKULU07J0oqN7cszrsEq8MUgaE',
    category: 'burgers',
    chefChoice: true,
    calories: 650,
    tags: ['Grass-Fed Beef', 'Chef\'s Choice'],
    thumbnails: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuChDPNIiqo0JQ6qVOPYy9N4alV5SPtUNs-Av3JWlfoGIghnzdf7xIWlexCacxjNrtbgedPJyygVmCGn5mqcjW4MABD4HFNcOzmr7vQhJWY-3HlkoYkW5cZArSQvT0pqcZ3zflXjTw0bTd3E2bMonHjmd4uLbx7kBC1IhZainNxH9pYIQ9OtLghHs1BRXs0vKcu2jD0v9bqoK4B_Mvzf14ZukrVNFkQDbVb8NiHHkJjWJuQ2gbOdsDfOfgtEP6A0mZX_iWaNd35GY8RE',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuApJJ76S6-7xnQRWmFWn1GaF5Hu1VYR2D-KI4QEtUwzAfSqLh_z2JVrtftYnw5FhfDzoqoU0Z-0HowyW5y1Bg8QHAhVbaP5_AOwbRM8UfGji-InI_VbRmwX9vxUgKDfTZKfkOWAnAZlHEnkZahThY77ScZr8dPl8ahdpj_G7Xd9kKCzePuoaYGYsHlWDZKnUj5tZwm27B2zgwJQyofiUsTiETlKvMBtUDal_1m88tbdv3_C1Hr71RnwU96NQkiJsby_6v6isltpLNLG',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCuy-KTlke6-VkeTI6D7xBFRt9_KqIporlhrXelPGiU4xEhCMtfnOSRYFjhwortoHmF7t4fnKZjuR7IatAxxfzSru4KoQys8YHRDWInl2d4tzzQ5J0DZDBdB6OWRm1KsbRy5NLjjjPcYkPaNmvWuApPVIpDy87Hoc3mr6r6EC0vhBz1Itz2itadJxeP_CfPVVImBTcG1bM40QBhKs867eINLT90mZ1mKWu0-27cZOLPQoFbaRGhbkcOf6_ZtvmMhmnNoXuPo0Yjf-Ky',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC6jDuNRKDhJKqXosW7N9a7R-ItAucygruYYGGIyyzoYsP5cJAJOpqGKBcmHy9eP3oVe7ySEg1Oky45HHsUKhujIHXlBT5OZSxE2fCAocOHQAwMfaI4SOQUWc2lqahp1mV4fucBDschbwY_2MUWJ-9jP_xFpowR75TLTvZCPe9kHpPHu8duPIs5XTFcs8-fOqpSNb61zzkeh_9Iy_2gqRIbrLyu9oAAAepzTWPRuBTdn6_oh6t-DDFdA-nLmBWZRmvKBKsZbbRolQMP'
    ]
  },
  {
    id: 'the-purest',
    name: 'The Purest',
    description: '4oz Grass-fed beef, sea salt, aged cheddar, and a splash of house-made mustard. That\'s it.',
    price: 12.50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHAPJEFC_NPMOReVZkL3ES2L4ER5bigh59qNZW1bG2NxGSn6JTq72-3eTfP3PDlpthEn-wqZcttSmayrO6b3OavoHLckIP4gLy3HiopbfEJl23eeuRPWPSErZwm16jltfdKVLE1nkyKjPs-zRuBwKCnjABVQ3nrSzjFiXK_9_TAkdMkT2KF22FpH-g3wtC-70WG_iqLVm97yt9guYpXNUPxTLnR0QKZPJzIqbzDTGPlUP9r-7e-jvCmA5BA96m9nPMkhOfNTsoeBCH',
    category: 'burgers',
    isBestSeller: true,
    calories: 450,
    tags: ['Minimalist', 'Grass-Fed']
  },
  {
    id: 'green-honest',
    name: 'Green Honest',
    description: 'House-made plant patty, avocado smash, pickled onions, and micro-greens. 100% vegan, zero compromise.',
    price: 14.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-OtZ0NxWbT1w-gESNPSw_f87AXVhSiT1yHRQI67Z2b5pTsiYQo64leyVhj8svlDZuiM_ydMZ_mpApF8QcUmekEGvoGXpERZE4Dg2TZ-KhJuA63GMepk-A15_SVjbr8tgN9hm2we9QMO1Lr9ELbpRJu7i5ndgIYqRjJP3HY633c_NOE_YAA6E-z8dMTBfv9kdROJYzSVu3j9AZ8yBABQhsDDAhUA5RrEJp5nFI1Ei2ViYUq8c_yJafv_RiIGADEnAOJdzMTml7bgIP',
    category: 'burgers',
    calories: 510,
    tags: ['Vegan', 'Plant-Based']
  },
  {
    id: 'triple-cut-fries',
    name: 'Triple-Cut Fries',
    description: 'Golden, hand-cut triple-cooked fries served in a simple white ceramic bowl, with sea salt crystals.',
    price: 4.50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvrdh1SyW2VAHoGuoIB_xXncpkHz-i0XLMF187ANHJ8uFz9RROfNKvUOME0lb0c1fOc3Q5okADy-kiIcwG-RcfYgCGEthQAM_wCwbjw_ndmMgX_HA2eDrukGMs6X6MOK5e8Ik9vr3heM-wQk7NiLBGKTjNQQtm5Hs7nffffdwBokE2wVGVJM_5w9ElGNd-uVkEUC2qLPNJOSuBh6NIMIZlPm-7egRGSy1gNnNcon1Upj0jrttStJ1G_eMTcsqizQjCzWZid9v1SQw5',
    category: 'sides',
    calories: 380,
    tags: ['Crispy', 'Classic']
  },
  {
    id: 'panko-rings',
    name: 'Panko Rings',
    description: 'Thick-cut, panko-crusted onion rings stacked neatly on a white surface, crunchy and golden.',
    price: 5.50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC1OODgYCwbCjhsY1CFnxRtk-W3kuNBP5N0FBoxYux6GaZYoQTHRO3mewCXuw6bVHiR7ZjhIkXRjCXP-QqktOIITP2DwRmzPBVkZLQiEz_5dxD0hsdXOrB_RwAQMkvrGXbflPuGANRyKVwVwIUSX5l4dc6oTm1JTY70LPqAaXc7q8ZaRJ4UdC-b81WGSsf8dC9S69qrRajGOEXhtqbdOg1pn7bgwqCqxfWzakA4rMU79ABCSLWSs5mcNYz2PuIolnRHiIRj-UoLIIQ',
    category: 'sides',
    calories: 420,
    tags: ['Panko', 'Golden']
  },
  {
    id: 'honest-greens',
    name: 'Honest Greens',
    description: 'A small, vibrant kale and shaved sprout salad with a lemon zest dressing in a minimalist white bowl.',
    price: 6.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJQxxLLXjPwOHwZKTUgTTo1wYBo7WpUzHDghXtSmH3DYcNZjbAX1WXHvCeWRIatBr21_P71WcAUbkeSuTpIwonlZ60ukLLRy_KI-07_wQh01JB_WAiq4HGLkR9wiEfmXKS-zAaswWsbjcoMpoCGlAKBY8zLY_DaOQwf8LBetKvJZzzPZp3TpoVJsjZSt4pY_TIZSvF5uq1RcsKbsnoDGj1L1iXq2K8s8Yxducn0SnGjXE7m4eiXPPFgh9K-6psB_msPhuXuCSImomd',
    category: 'sides',
    calories: 180,
    tags: ['Healthy', 'Organic']
  },
  {
    id: 'truffle-fries',
    name: 'Truffle Salt Fries',
    description: 'Gourmet triple-cooked fries, lightly seasoned with truffle salt, shaved parmesan, and fresh herbs.',
    price: 5.50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa8wBuo84LfROVuAZY0fnwCt0RYysH7cxdY0tqM4RJYWonImytQK4wMqnNCfdbt8815cKMhwqovYqpQ-hqvZkF874jDLqIKaC6ra6zettDYVqlw6AS7w2iFcQ9Jq52KOSwQ7oJAWB37xJJAVRNy8IwJxoRZ_27H93R6eSLx1S6I0KmqeJ6WFGST8nui1ZEsNBAnK9vEwxtFafr44dth2840n0TlBSliN4mWxY9KK6W1a6YnCQgk9BWIWurfWnHj0AFBIpksobfmEwA',
    category: 'sides',
    calories: 440,
    tags: ['Truffle', 'Premium']
  },
  {
    id: 'house-lemonade',
    name: 'House Lemonade',
    description: 'Freshly squeezed lemons, pure cane sugar, chilled and sparkling.',
    price: 3.50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ7fg3NGszidaHKSL_xKVLv0bRcxu3L3H-Q5XpFJxzHEHZsFViu7chZYUtsBXC1-ph5AbK3MeGuZLabYnbe23oLSJieIHUQF8vDCMrvLRK4OK-ywtnCygb1NnmeI_eSUp7dO2-aXXFevTPWKhUW4UVp4g6McFdE_SrdRpNTovKYeP5ZL0l5aM_bEda5eBPVM0OGWP5qYLLDUBxZW05lFHh9qYFFIOx5FmyMgPmcxIVS6g8ACAJPgggEfgK1Ubud6m6vg8HkJ6pr-vg',
    category: 'drinks',
    calories: 120,
    tags: ['Refreshing', 'Real Fruit']
  },
  {
    id: 'spiced-ginger-beer',
    name: 'Spiced Ginger Beer',
    description: 'Small batch craft ginger beer with a spicy kick and zero artificial sweeteners.',
    price: 4.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBggfk8LoKG6UUTriiAKTz-WdBIFXSqojQ6tatvAkkkgELySpkQPHlQkLPh3sUHkcGkXTgrbjae8Uv8oKOXX67yKoBNDJwMVheyFKw8VYzW6qH3s0TruWLKlNDtSBygt3HLqZ2Us-L3XGm3mi5mFHr5PGRa8iFfFiSW4V78dnJXR4Q0oAExQ-niOxJFk0UUDoYSE8AffgW7_SHHfxGGPDPuALWjvPwPEFoy481nYUNemHi5sH81k4AqHJ0cJOJL6bykUSNOl9QDI3T2',
    category: 'drinks',
    calories: 140,
    tags: ['Craft', 'Spicy']
  },
  {
    id: 'house-soda',
    name: 'House Soda',
    description: 'Refreshing house-made lemon lime soda with crushed ice and fresh mint leaves, crisp and sweet.',
    price: 3.50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAb4Vt_smwfUvnE69uElkmEY2iL7hfV1-RV75AotmSf0zQ8di8FSJobci-W3N3UXyDPdLuxO_jd9M3UNvnv1O5uVJ_hPkIXvpUpMLR3EWXY7-B8cZLNkwjHc9mHAk0XJUpl4HW2k53IKLxXgux4BFqmntsD5c8KxBrvT5fGg-IRljRPSE7mZX8mnuo_6gr3FVCjtOg25KIL9IwTKPv5O74p_MfZHDD3jbeKFMimBi9rkdaoufz8tb2CJJA4gArS4ntLWZ_bAx6GMFGK',
    category: 'drinks',
    calories: 110,
    tags: ['Minty', 'Sparkling']
  },
  {
    id: 'madagascar-vanilla',
    name: 'Madagascar Vanilla',
    description: 'Real bean vanilla, pasture-raised dairy, whipped to absolute thick creaminess. Nothing else.',
    price: 7.50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq6sosqRqXXCUeTaZ_bVlh--HROe4SwyvyUvvIx14Yhktjx_Bgbaw-6EmA3DCC1eCxIFTmbNo2kYHzOGIYx4ue1-N7_GMgT0XvJNlcaemDpY09lHxR0RzdCOuZhUBQZfuDG02QJCuSatNwVbsVoLxijAtaFb8wU3Ta2zlxnlJfcNycD033J2pjkFzTn3duSlU3Z7w-oTaYgs1Q9gR_XqI5GAN5knbGDn8fJzcO8l9mIB-OMYxN4uUe4aYsro95mXIhexOfmfSsDRet',
    category: 'shakes',
    calories: 520,
    tags: ['Vanilla Bean', 'Pasture Dairy']
  },
  {
    id: 'cacao-dark',
    name: '70% Cacao Dark',
    description: 'Single-origin 70% dark chocolate blended to creamy perfection with fresh organic milk.',
    price: 8.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDipqIddr3snrCNuxkshGBXl8IYqmHj05adDxoYqArw1meGux8zCErYvrv6mx4YhqyB3Jn4o6e-00vfxqP_RWOWbA9rAQaMDjU92aA6nts-Z7nO3Rc-fkpBb153fnolVaIRFg_kmCI7vDmAdwyyt1isil6LQHfOAuYjICtUt8MhQ3Lyd2jSe6F1hEWDybI46N70XzATlwPTg2V8eN7BzSboybhAXqGcWZ58TT-l9ADn1cyJvZNF0erVYmfxLpaWDlBHY7YOzgmJyYv1',
    category: 'shakes',
    calories: 580,
    tags: ['Dark Chocolate', 'Decadent']
  }
];

export const LOCATIONS: LocationData[] = [
  {
    id: 'dtla',
    name: 'Downtown LA',
    address: '842 S Broadway, Los Angeles, CA 90014',
    hours: 'Open Now • Closes 11PM',
    status: 'open',
    statusLabel: 'Open Now',
    mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbP25PwBauRYWTEsyw7hlgD-gVYKfEFLhlYv-06u5RgpkiELdfrOss52r0vB7F2V5GQEEP6F3Myq2peBp4O12GVJ00dfYk1K1EniYQz0eILXIqoSxtdADwe9CS3CMmVRNtv90vH22ngPyxOFrZiwaWGq5eyBGO8ZcN_SSZyTWFP5YyhFg-FtS675-2iJnb7l_XZEdlJSFYi6rBWMDT7JKf_fadoRsG10K0gIUpTn9dhdvhRMu88-4nAsEKBwWw8u4aNmVyYa3jx_I4'
  },
  {
    id: 'santa-monica',
    name: 'Santa Monica',
    address: '1202 3rd St Promenade, Santa Monica, CA 90401',
    hours: 'Opening Soon • Fall 2024',
    status: 'coming-soon',
    statusLabel: 'Coming Soon',
    mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbP25PwBauRYWTEsyw7hlgD-gVYKfEFLhlYv-06u5RgpkiELdfrOss52r0vB7F2V5GQEEP6F3Myq2peBp4O12GVJ00dfYk1K1EniYQz0eILXIqoSxtdADwe9CS3CMmVRNtv90vH22ngPyxOFrZiwaWGq5eyBGO8ZcN_SSZyTWFP5YyhFg-FtS675-2iJnb7l_XZEdlJSFYi6rBWMDT7JKf_fadoRsG10K0gIUpTn9dhdvhRMu88-4nAsEKBwWw8u4aNmVyYa3jx_I4'
  }
];
