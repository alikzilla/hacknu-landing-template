import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Question, Plus, Minus } from "phosphor-react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Как работает ваш ИИ-чатбот и чем он поможет?",
      answer:
        "Чатбот собирает базовые данные (доход, обязательные расходы, цель, срок) и строит персональный финансовый роудмэп: ежемесячные суммы, вехи, чек-листы действий. Он учитывает исламские принципы (без рибы) и предлагает халяль-решения, а также напоминает о шагах и отслеживает прогресс.",
    },
    {
      question: "Это исламский банк: как вы соблюдаете шариат-принципы?",
      answer:
        "Мы не предлагаем продукты с рибой (процентами) и спекулятивными доходами. Используем модели халяль-финансирования (например, мурабаха, иджара, мушарака), включаем этический скрининг и консультируемся по вопросам соответствия нормам шариата.",
    },
    {
      question:
        "Чем халяль-финансирование отличается от обычной «ипотеки под проценты»?",
      answer:
        "В халяль-моделях банк не взимает проценты. Например, при мурабаха банк покупает недвижимость и продаёт её клиенту с прозрачной наценкой (маржой), фиксируя общую стоимость и график выплат. При иджара клиент арендует объект с последующим выкупом. Все условия оговариваются заранее.",
    },
    {
      question:
        "Как вы рассчитываете план накоплений на квартиру (например, 70 млн ₸)?",
      answer:
        "Мы предлагаем безопасную норму сбережений от вашего дохода, считаем размер первоначального взноса (часто 20–30%), срок накопления и ежемесячную сумму. План адаптируется под вашу ситуацию: уже накопленные средства, желаемый срок, семейные расходы.",
    },
    {
      question: "Можно ли задать свой срок или сумму ежемесячных сбережений?",
      answer:
        "Да. Вы можете зафиксировать желаемый срок—мы посчитаем требуемую сумму в месяц. Или, наоборот, задать сумму в месяц—мы оценим срок достижения цели. Чатбот предложит несколько сценариев.",
    },
    {
      question: "Что такое «вехи» в роудмэпе и зачем они нужны?",
      answer:
        "Вехи—это этапы: финансовая подушка, накопление первоначального взноса, оформление сделки, переезд и т.д. Они дают понятную структуру, а чатбот подсказывает конкретные шаги на каждом этапе.",
    },
    {
      question: "Есть ли геймификация и мотивация?",
      answer:
        "Да. За выполненные шаги вы получаете XP, поддерживаете «серию» (streak), открываете мини-награды. Это помогает не терять темп и доводить цель до результата.",
    },
    {
      question: "Как план учитывает изменение дохода или рост цен?",
      answer:
        "В план заложены сценарии: падение дохода, рост стоимости жилья, изменение условий. При изменениях чатбот предложит корректировки: увеличить срок, скорректировать норму сбережений или пересобрать маршрут.",
    },
    {
      question: "Какие документы понадобятся для халяль-финансирования жилья?",
      answer:
        "Как правило, нужны удостоверение личности, подтверждение доходов, документы по объекту и др. Точный список зависит от продукта (мурабаха/иджара и т.п.)—чатбот выдаст чек-лист под вашу ситуацию.",
    },
    {
      question: "Бывает ли комиссионная нагрузка вместо процентов?",
      answer:
        "В халяль-моделях применяется прозрачная маржа и/или фиксированные сборы, сформулированные в договоре заранее. Мы показываем итоговую стоимость сделки, график и сумму выплат без скрытых начислений.",
    },
    {
      question: "Можно ли досрочно погашать и как это оформляется?",
      answer:
        "Да, досрочное погашение возможно. Условия зависят от конкретного продукта и договора. Чатбот подскажет порядок действий и пересчитает оставшиеся платежи.",
    },
    {
      question: "Как защищены мои данные и кто их видит?",
      answer:
        "Мы используем шифрование и политику минимально необходимого доступа. Ваши данные не передаются третьим лицам без вашего согласия. Вы можете запросить выгрузку или удаление данных в любой момент.",
    },
    {
      question: "Поддерживаются ли русский и казахский языки?",
      answer:
        "Да, интерфейс и консультации доступны на русском и казахском. Мы продолжаем улучшать локализацию и финансовые справочники по регионам.",
    },
    {
      question: "Есть ли бесплатный пробный период/демо?",
      answer:
        "Да, вы можете бесплатно попробовать генерацию плана и базовые подсказки. Расширенные функции и персональное сопровождение доступны в платных тарифах.",
    },
    {
      question: "Как связаться со специалистом, если вопрос сложный?",
      answer:
        "В любой момент нажмите «Связаться с консультантом»—мы передадим ваш диалог сотруднику. Он увидит контекст и предложит решения, соответствующие исламским принципам и вашей ситуации.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-20 overflow-hidden" id="faq">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      <div className="absolute inset-0 particles opacity-10"></div>

      <div className="container lg:px-20 px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center space-x-2 glass-card px-4 py-2 mb-6"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Question size={16} className="text-primary" weight="fill" />
            <span className="text-sm text-foreground/80">Есть вопросы?</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-foreground">Частые</span>{" "}
            <span className="holographic">вопросы</span>
          </h2>

          <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Здесь вы найдёте ответы о нашем ИИ-ассистенте и
            халяль-финансировании. Не нашли нужного? Напишите — ассистент
            подскажет!
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="w-full">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="mb-4"
            >
              <motion.button
                onClick={() => toggleFAQ(index)}
                className="w-full glass-card p-6 text-left hover:bg-white/5 transition-all duration-300 group"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-primary flex-shrink-0"
                  >
                    {openIndex === index ? (
                      <Minus size={20} weight="bold" />
                    ) : (
                      <Plus size={20} weight="bold" />
                    )}
                  </motion.div>
                </div>
              </motion.button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="glass-card mx-4 p-6 mt-2 mb-2 border-t border-primary/20">
                      <motion.p
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="text-foreground/80 leading-relaxed"
                      >
                        {faq.answer}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
