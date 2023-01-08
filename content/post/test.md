---
title: test
date: 2023-01-07T00:00:00+09:00
math: true
draft: true
---

# test

<!-- $$ \frac{\delta x_i(t)}{t} = \frac{x_i(t)}{t}|\_{(x_1, x_2, \cdots, x_k) = (x^\*_1, x^\*_2, \cdots, x^\*_k)} $$  
ああ$ \frac{\delta x_i(t)}{t} = \frac{x_i(t)}{t}|\_{(x_1, x_2, \cdots, x_k) = (x^\*_1, x^\*_2, \cdots, x^\*_k)} $ああ
$$ \frac{\delta x\_i(t)}{t} = \frac{x_i(t)}{t}|\_{(x\_1, x\_2, \cdots, x\_k) = (x^\*\_1, x^\*\_2, \cdots, x^\*\_k)} $$  
$$ \frac{\delta x_i(t)}{t} = \frac{x_i(t)}{t}_{(x_1, x_2, \cdots, x_k) = (x^\*_1, x^\*_2, \cdots, x^\*_k)} $$  
$$ \frac{\delta x_i(t)}{t} = \frac{x_i(t)}{t} $$  
$$ x\_{xxx} $$  
$$ x\_i, x\_ii $$  
$$ |\_{(x_1, x_2, \cdots, x_k) = (x^\*_1, x^\*_2, \cdots, x^\*_k)} $$  
あああ
$$ {(x_1, x_2, \cdots, x_k) = (x^\*_1, x^\*_2, \cdots, x^\*_k)} $$  
$$ f_i((x^\*_1, x^\*_2, \cdots, x^\*_k)) $$ -->

$$ \delta x\_i(t) = \bm{T}^{-1}\_i \cdot \bm{v} $$
$$ = \sum\_j T^{-1}\_{ij}v\_j(t) $$
$$ = \sum\_j \exp(\lambda\_j t) T^{-1}\_{ij} v\_j(0) $$
$$ = \sum\_j \exp(\lambda\_j t) T^{-1}\_{ij} \sum\_m T^{-1}\_{jm} x\_m(0) $$
$$ = \sum\_{j, m} \exp(\lambda\_j t) T^{-1}\_{ij} T\_{jm} \delta x\_m(0) $$