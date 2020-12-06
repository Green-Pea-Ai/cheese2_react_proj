import React, { useState, useEffect } from "react";
import axios from 'axios'
import { context as c } from '../../../../modules/context'

import { motion } from "framer-motion";
import tw from "twin.macro";
import styled, { css } from "styled-components/macro"; //eslint-disable-line
import { Container, ContentWithPaddingXl } from "../../../../components/cmm/Layouts.jsx";
import { SectionHeading } from "../../../../components/cmm/Headings.jsx";
// import { SectionDescription } from "../../../../components/cmm/Typography.jsx";
import { ReactComponent as ChevronDownIcon } from "feather-icons/dist/icons/chevron-down.svg";
import { ChatbotContainer as Chatbot } from "../../../cop/chatbot"

const PrimaryBackgroundContainer = tw(Container)`px-4 bg-yellow-500 text-gray-100 text-black text-center`;

// const ThreeColumn = tw.div`flex flex-col items-center lg:items-stretch lg:flex-row flex-wrap`;
const ThreeColumn = tw.div`text-center mx-0`;
const Column = tw.div`mt-24 mx-96`;
const Card = tw.div`lg:mx-4 xl:mx-8 max-w-sm lg:max-w-xs`;
const Image = styled.div(props => [
  `background-image: url("${props.imageSrc}");`,
  tw`bg-cover bg-center h-80 lg:h-64 rounded`
]);
const Category = tw.div`mt-4 text-secondary-100 font-bold text-sm`;
const Title = tw.h4`inline-block mt-2 leading-relaxed font-bold text-lg cursor-pointer transition duration-300 border-b-2 border-transparent hover:border-black`;
const Contents = tw.div`mt-2 text-sm text-primary-500 font-bold `;

const HeadingContainer = tw.div``;
// const Subheading = tw(SubheadingBase)`text-center text-gray-100 mb-4`;
const Heading = tw(SectionHeading)``;
// const Description = tw(SectionDescription)`mx-auto text-center text-gray-300`;

const FaqsContainer = tw.div`mt-10 sm:mt-16 w-full flex-1 lg:flex justify-between items-start max-w-screen-lg mx-auto`;
const FaqsColumn = tw.div`w-full lg:max-w-lg lg:mr-8 last:mr-0`;
const Faq = tw.div`select-none cursor-pointer border-b-2 border-yellow-300 hover:border-yellow-500 transition-colors duration-300 py-6`;
const Question = tw.div`flex justify-between items-center`;
const QuestionText = tw.div`text-sm sm:text-lg font-semibold tracking-wide`;
const QuestionToggleIcon = styled(motion.span)`
  ${tw`ml-2 transition duration-300`}
  svg {
    ${tw`w-6 h-6`}
  }
`;
const Answer = tw(motion.div)`hidden text-sm font-normal mt-4 text-gray-300`;


export default function RecommendResult ({
  subheading = "",
  heading1 = "고객님께 추천드리는 치즈상품은",
  heading2 = "입니다.",
  // description = "새알을 빚어놓은 듯 깜찍한 미니 모짜렐라",
  faqs = [
    {
      question: "영양정보",
      answer:
        "총 내용량 (80g) 255 kcal, 총 내용량당 (% : 1일 영양성분기준치에 대한 비율) - 나트륨 : 80mg / 4% · 당류 : 21g /21% · 포화지방 : 2.8g / 19% · 단백질 : 6g / 11%"
    },
    {
      question: "알레르기 정보",
      answer:
        "우유 함유"
    },
    {
      question: "이 상품을 좋아하시는 분들은 이런 치즈도 좋아하세요.",
      answer:
        "스프레더블 리코타 치즈, 바이에른탈러 에멘탈 치즈, 블루 도베르뉴, 샤우르스"
    },
    {
      question: "추천 결과가 맘에 드시나요?",
      answer:
        "맞춤 추천 서비스를 이용하시고 치즈도 구매해보세요."
    },
    {
      question: "다른 분들은 어떤 치즈를 추천 받았을까요? ",
      answer:
        "궁금하신가요? 저도 궁금하네요."
    },
    {
      question: "결과가 마음에 들지 않으신다면 우측 하단의 챗봇에게 의견을 남겨주세요.",
      answer:
        "챗봇이 고객님의 취향을 파악해서 다음에는 더 정확한 추천을 해줄거에요.",
    }
  ]
}) {
  const faqCol1 = [];
  const faqCol2 = [];
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(null);

  const toggleQuestion = questionIndex => {
    if (activeQuestionIndex === questionIndex) setActiveQuestionIndex(null);
    else setActiveQuestionIndex(questionIndex);
  };

  faqs.map((faq, index) => {
    const renderedFaq = (
      <Faq key={index} onClick={() => toggleQuestion(index)}>
        <Question>
          <QuestionText>{faq.question}</QuestionText>
          <QuestionToggleIcon
            variants={{
              collapsed: { rotate: 0 },
              open: { rotate: -180 }
            }}
            initial="collapsed"
            animate={activeQuestionIndex === index ? "open" : "collapsed"}
            transition={{ duration: 0.02, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <ChevronDownIcon />
          </QuestionToggleIcon>
        </Question>
        <Answer
          variants={{
            open: { opacity: 1, height: "auto", marginTop: "16px", display: "block" },
            collapsed: { opacity: 0, height: 0, marginTop: "0px", display: "none" }
          }}
          initial="collapsed"
          animate={activeQuestionIndex === index ? "open" : "collapsed"}
          transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
        >
          {faq.answer}
        </Answer>
      </Faq>
    );

    if (index % 2 === 0) faqCol1.push(renderedFaq);
    else faqCol2.push(renderedFaq);

    return null;
  });

  const [recommends, setRecommends] = useState([])

  useEffect(() => {
    const fetchRecommend = async () => {
      try {

        const user_id = sessionStorage.getItem('sessionUser')
        const response = await axios.get(
          `${c.url}/api/recommend/${user_id}`
        );

        setRecommends(response.data)
        console.log(response.data)
      } catch (e) {
        alert(`Search fail`)
      }
    };

    fetchRecommend();
  }, []);


  return (
    <PrimaryBackgroundContainer>
      <Chatbot/>
      <ContentWithPaddingXl>
        <HeadingContainer>
        {recommends.map(recommend => (
          <Heading>{heading1}<br/>[{recommend.name}]{heading2}</Heading>
        ))}
        </HeadingContainer>
        <ThreeColumn>
          {recommends.map(recommend => (
            <Column  key={recommend.cheese_id}>
              <Card>
                <Image imageSrc={recommend.img}/>
                <Title a>{recommend.name}</Title>
                <Contents>{recommend.brand}</Contents>
                <Contents>{recommend.texture} / {recommend.types}</Contents>
                <Category>{recommend.content}</Category>
                {/* <Link href={cheese.content}>Read Post</Link> */}
              </Card>
            </Column>
          ))}
        </ThreeColumn>
        <FaqsContainer>
          <FaqsColumn>{faqCol1}</FaqsColumn>
          <FaqsColumn>{faqCol2}</FaqsColumn>
        </FaqsContainer>
      </ContentWithPaddingXl>
    </PrimaryBackgroundContainer>
  );
};
