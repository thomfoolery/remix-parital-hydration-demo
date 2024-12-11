function getLargeDataObject() {
  return Array.from({ length: 100 }).reduce((acc: string[]) => {
    return [
      ...acc,
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maiores obcaecati aliquam nesciunt minima facilis iure alias, nulla soluta accusamus libero beatae repudiandae mollitia esse ab, dolore tenetur totam deleniti? Fugiat.",
      "Deleniti ea eius quasi dolorum quae! Tenetur eligendi sint praesentium maiores eveniet porro incidunt illo amet quo, culpa ipsum. Necessitatibus tempore facere odit unde temporibus aspernatur architecto doloribus mollitia dicta.",
      "Id ad explicabo ullam nam nobis nisi placeat quis ratione eum recusandae iure a fugiat necessitatibus perferendis et, sint, amet illo? Officiis labore voluptatum quaerat, fugit incidunt rem a sint!",
      "Ab, fuga maiores! Veritatis optio iure quas repellendus exercitationem magni, earum molestiae, quam recusandae ratione cumque. Quo minus quos, sed repudiandae expedita, adipisci, repellendus quam incidunt quasi laboriosam aspernatur ut.",
      "Deserunt, libero sequi. Aliquam, harum! Laudantium, enim a impedit necessitatibus ab assumenda, deserunt ipsa reprehenderit suscipit quae excepturi neque exercitationem ad harum magni sequi. Eos voluptas itaque hic repellendus omnis?",
      "Ab saepe quod qui, ipsam numquam a similique adipisci nostrum. Rerum animi perferendis quasi cupiditate officia placeat totam incidunt culpa! Adipisci voluptates quidem commodi, tenetur optio harum alias doloribus inventore!",
      "Soluta at aspernatur ad? Ab repellat accusantium ut tenetur sequi recusandae, voluptatibus optio eum eos maiores asperiores voluptatem illum laboriosam adipisci nemo reprehenderit repudiandae. Error omnis ea nobis nesciunt delectus.",
      "Atque fugiat quisquam quaerat natus eos. Voluptate rerum aut nemo et ratione debitis. Iure minima, asperiores corporis impedit deserunt earum voluptate eligendi amet qui non nulla excepturi eius, vel enim.",
      "Tempore porro similique iste sapiente, temporibus quos illum explicabo. Excepturi veniam blanditiis molestiae quis eligendi neque perspiciatis itaque alias ex nostrum, dolore ea voluptatibus repellat, omnis illum. Accusamus, optio neque.",
      "Voluptate quisquam reiciendis doloremque sint aliquam deleniti autem eveniet! Perspiciatis adipisci voluptatem, aliquam, mollitia magnam fuga autem exercitationem molestiae veritatis corrupti commodi obcaecati maiores itaque impedit nihil, est nam totam.",
    ];
  }, []);
}

export { getLargeDataObject };
