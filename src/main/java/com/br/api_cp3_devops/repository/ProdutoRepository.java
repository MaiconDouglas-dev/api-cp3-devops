package com.br.api_cp3_devops.repository;

import com.br.api_cp3_devops.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}