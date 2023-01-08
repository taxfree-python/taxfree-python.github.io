---
title: test_2
date: 2023-01-07T00:00:00+09:00
katex: true
draft: False
---

$x^2$

$$x^2$$

$x\^2$

$$x\^2$$

$x*2$

$$x*2$$

$x^*2$

$$x^*2$$


$(x^{\*}_1, x^{\*}_2, \cdots, x^{\*}_k)$

$x_i(t) = x^*_i + \delta x_i(t)$

あああ，$x_i(t) = x^*_i + \delta x_i(t)$あああ$x_i\delta$ああ$xx\delta$

# test-1
ここで，$x_i(t) = x^*_i + \delta x_i(t)$として，

これを$f_j$に代入して，$x^*_i$の周りでテイラー展開して$\delta x_i(t)$の1次だけを残す．

# test-2
ここで，$x_i(t) = x^*_i + \delta x_i(t)$として，これを$f_j$に代入して，

$x^*_i$の周りでテイラー展開して$\delta x_i(t)$の1次だけを残す．

# test-3
ここで，$x_i(t) = x^*_i + \delta x_i(t)$として，これを$f_j$に代入して，$x^*_i$

の周りでテイラー展開して$\delta x_i(t)$の1次だけを残す．

# test-4
ここで，$x_i(t) = x^*_i + \delta x_i(t)$として，これを$f_j$に代入して，$x^*_i$の周りでテイラー展開して

$\delta x_i(t)$の1次だけを残す．

# test-5
ここで，$x_i(t) = x^*_i + \delta x_i(t)$として，これを$f_j$に代入して，$x^*_i$の周りでテイラー展開して$\delta x_i(t)$

の1次だけを残す．

# test-6
ここで，$x_i(t) = x^*_i + \delta x_i(t)$として，
これを$f_j$に代入して，$x^*_i$の周りでテイラー展開して$\delta x_i(t)$の1次だけを残す．

# test-7
これは，式を固定点の周りでテイラー展開して，(最低次で)線型化すれば判定できる．今，固定点を$(x^{\*}_1, x^{\*}_2, \cdots, x^{\*}_k)$とし，固定点の定義より$f_j(x^\*_1, x^\*_2, \cdots, x^\*_k) = 0 (j = 1, 2, \cdots, k)$を満たす．
ここで，$x_i(t) = x^*_i + \delta x_i(t)$として，これを$f_j$に代入して，$x^*_i$の周りでテイラー展開して$\delta x_i(t)$の1次だけを残す．

ここで，$x_i(t) = x^*_i + \delta x_i(t)$として，これを$f_j$に代入して，$x^*_i$の周りでテイラー展開して$\delta x_i(t)$の1次だけを残す．
\begin{align}
    \dv{\delta x_i(t)}{t} & = \dv{x_i(t)}{t}|_{(x_1, x_2, \cdots, x_k) = (x^*_1, x^*_2, \cdots, x^*_k)} \notag \\
        & = f_i((x^*_1, x^*_2, \cdots, x^*_k)) \notag \\
        & + (\delta x_1(t) \pdv{}{x_1} + \delta x_2(t) \pdv{}{x_2} + \cdots + \delta x_k(t) \pdv{}{x_k}) \notag \\
        & \times f(x_1, x_2, \cdots, x_k) + R(x^*_1, x^*_2, \cdots, x^*_k) \notag \\
        & = \sum_j J_{ij} \delta x_j(t)
        \label{eq:diagonalization}
\end{align}