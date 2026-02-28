import { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { MoveHorizontal } from 'lucide-react';

export default function ReadingPart3() {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const handleRadioChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Part Header */}
      <div className="bg-gray-100 border-b border-gray-300 px-6 py-3">
        <h2 className="font-bold">Part 3</h2>
        <p className="text-sm">Read the text and answer questions 27–40</p>
      </div>

      {/* Split View */}
      <div className="flex-1 flex overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Left: Reading Passage */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full overflow-y-auto p-6 ielts-scrollbar">
              <h2 className="text-xl font-bold mb-4">Plain English</h2>
              
              <p className="mb-4">
                There is no theoretical limit to the number of special purposes to which language can be put. As society develops new facets, so language is devised to express them. However, the result is often that language becomes very specialised and complex, and complications arise when ordinary people struggle to make sense of it.
              </p>

              <p className="mb-4">
                Popular anxiety over special uses of language is most markedly seen in the campaigns to promote 'plain' speaking and writing – notably, the Plain English movements of Britain and the USA. The main aim of these campaigns is to attack the use of unnecessarily complicated language ('gobbledygook') by governments, businesses and other authorities whose role puts them in linguistic contact with the general public. The campaigners argue that such language, whether spoken or written, should be replaced by clearer forms of expression.
              </p>

              <p className="mb-4">
                The movements soon took shape once the public became aware of the nature of communication problems. But they have certainly played a major part in promoting public awareness of the existence of communication problems, and have influenced many organisations to do something about it. In Britain, the campaign was launched in 1979, by a government that had published a report telling departments to improve the design of forms, and to abolish those that were unnecessary. By 1985, around 15,700 forms had been revised. In the USA, President Carter's Executive Order of March 1978 required regulations to be written in a manner that could be understood by those who had to comply with them, and the annual Doublespeak Awards, given to American public figures who have perpetrated the clearest and most outstanding examples of language at its most grossly unintellectual, deceptive, evasive, euphemistic, confusing or self-contradictory.
              </p>

              <p className="mb-4">
                In these cost-conscious days, it is stressed that clear language not only avoids anxiety on the part of the recipient, it also saves time and money. The campaigners have large dossiers of problem cases. In one case, an official government letter provoked so many complaints and questions that a second letter had to be sent to explain the first. In another, an application form was wrongly filled in by 50% of the applicants, which resulted in a considerable outlay of effort in returning and reprocessing the form. In contrast, there are many cases on record of firms which have benefited from a language improvement policy, reporting huge increases in business or savings in salary costs.
              </p>

              <p className="mb-4">
                Particular concern is expressed about the ambiguities and omissions found in medical labels. For example, in one pharmaceutical survey, the instruction to 'use sparingly' was misunderstood by 33% of patients. The instruction 'take two tablets four hourly' was also misunderstood (e.g. is it two tablets every four hours, or two tablets four times a day?). Patients given bottles labelled as decongestants) and on toys for children.
              </p>

              <p className="mb-4">
                The instructions include warnings about the dangers of 'not' use companies seem to test their instructions by having them followed by a first time user. Often, essential information is included too late, and some steps are missed. This is especially worrying in any fields where failure to follow correct procedures can be dangerous.
              </p>

              <p className="mb-4">
                Objections to material in plain English have come mainly from the legal profession. Lawyers point to the risk of ambiguity inherent in the movement's recommendations. In one legal case, where the participants were asked to express a clause in a simplified form, every version produced was ambiguous, whereas the legal version was not. Ambiguity in the law can prove costly from time to time, and it could prove even more costly if statutes and regulations were written in a language that lacks the carefully worked-out and tested meanings expressed in legal terminology. The movement has perhaps been too ready to condemn material in an area where it is clearly vital to learn plain English materials.
              </p>

              <p className="mb-4">
                Similarly, professionals in several different fields have defended their use of technical and complex language as being the most precise means of expressing technical or complex ideas. This is undoubtedly true: scientists, doctors, bankers and others need their jargon in order to communicate with each other succinctly and unambiguously. But when it comes to addressing the non-specialist consumer, the campaigners argue, different criteria must apply.
              </p>
            </div>
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="relative w-2 bg-gray-300 hover:bg-gray-400 transition-colors group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-400 group-hover:bg-gray-500 border border-gray-500 flex items-center justify-center cursor-col-resize shadow-sm z-10">
              <MoveHorizontal className="w-4 h-4 text-white" />
            </div>
          </PanelResizeHandle>

          {/* Right: Questions */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full overflow-y-auto p-6 bg-gray-50 ielts-scrollbar">
              {/* Questions 27-33 */}
              <div className="mb-8">
                <h3 className="font-bold mb-3">Questions 27–33</h3>
                <p className="mb-4">
                  Choose <strong>TRUE</strong> if the statement agrees with the information given in the text, choose <strong>FALSE</strong> if the statement contradicts the information, or choose <strong>NOT GIVEN</strong> if there is no information on this.
                </p>

                <div className="space-y-6">
                  {[
                    { id: '27', text: 'The Plain English campaigns are concerned with the language officials use when communicating with ordinary people.' },
                    { id: '28', text: 'Campaigners found it difficult to talk to government officials.' },
                    { id: '29', text: 'A change of president in the US meant that the officials of the campaign there were negligible.' },
                    { id: '30', text: 'Vague language not only avoids anxiety but also saves time and money for companies that remove' },
                    { id: '31', text: 'Some companies have saved money by improving communication' },
                    { id: '32', text: 'Consumers complain if they do not understand the information given about medicines' },
                    { id: '33', text: 'Lawyers are concerned that the language officials use when communicating with ordinary people' },
                  ].map((question) => (
                    <div key={question.id} className="bg-white border border-gray-300 p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <span className={`px-2 py-1 text-sm font-bold min-w-[28px] text-center ${
                          question.id === '27' ? 'bg-[#0066CC] text-white' : 'border border-gray-400'
                        }`}>
                          {question.id}
                        </span>
                        <p className="flex-1">{question.text}</p>
                      </div>
                      <div className="ml-10 space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`q${question.id}`}
                            value="TRUE"
                            checked={answers[question.id] === 'TRUE'}
                            onChange={(e) => handleRadioChange(question.id, e.target.value)}
                            className="w-4 h-4"
                          />
                          <span>TRUE</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`q${question.id}`}
                            value="FALSE"
                            checked={answers[question.id] === 'FALSE'}
                            onChange={(e) => handleRadioChange(question.id, e.target.value)}
                            className="w-4 h-4"
                          />
                          <span>FALSE</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`q${question.id}`}
                            value="NOT GIVEN"
                            checked={answers[question.id] === 'NOT GIVEN'}
                            onChange={(e) => handleRadioChange(question.id, e.target.value)}
                            className="w-4 h-4"
                          />
                          <span>NOT GIVEN</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions 34-40 */}
              <div className="mb-8">
                <h3 className="font-bold mb-3">Questions 34–40</h3>
                <p className="mb-4">
                  Complete the sentences. Write <strong>NO MORE THAN TWO WORDS</strong> from the text for each answer.
                </p>

                <div className="bg-white border border-gray-300 p-4">
                  <div className="space-y-4">
                    <p className="flex items-start gap-2 flex-wrap">
                      <span>For nonspecialists, the use of complex language can have financial implications. The benefits of plain language can be seen in the case of companies that remove</span>
                      <input
                        type="text"
                        value={answers['34'] as string || ''}
                        onChange={(e) => handleInputChange('34', e.target.value)}
                        className="w-32 px-2 py-1 border-2 border-blue-500 bg-white text-center"
                        placeholder="34"
                      />
                      <span>from their forms and achieve</span>
                      <input
                        type="text"
                        value={answers['35'] as string || ''}
                        onChange={(e) => handleInputChange('35', e.target.value)}
                        className="w-32 px-2 py-1 border-2 border-blue-500 bg-white text-center"
                        placeholder="35"
                      />
                      <span>as a result.</span>
                    </p>

                    <p className="flex items-start gap-2 flex-wrap">
                      <span>Consumers often complain that they experience a feeling of</span>
                      <input
                        type="text"
                        value={answers['36'] as string || ''}
                        onChange={(e) => handleInputChange('36', e.target.value)}
                        className="w-32 px-2 py-1 border-2 border-blue-500 bg-white text-center"
                        placeholder="36"
                      />
                      <span>when trying to put together do-it-yourself products. Instructions for doing so could improve if the companies would test them or a</span>
                      <input
                        type="text"
                        value={answers['37'] as string || ''}
                        onChange={(e) => handleInputChange('37', e.target.value)}
                        className="w-32 px-2 py-1 border-2 border-blue-500 bg-white text-center"
                        placeholder="37"
                      />
                      <span>to substitute them. In addition, instructions should be presented in a logical sequence and any</span>
                      <input
                        type="text"
                        value={answers['38'] as string || ''}
                        onChange={(e) => handleInputChange('38', e.target.value)}
                        className="w-32 px-2 py-1 border-2 border-blue-500 bg-white text-center"
                        placeholder="38"
                      />
                      <span>that appears in an area where assumptions are made about a stage being self-evident or the consumer having a certain amount of</span>
                      <input
                        type="text"
                        value={answers['39'] as string || ''}
                        onChange={(e) => handleInputChange('39', e.target.value)}
                        className="w-32 px-2 py-1 border-2 border-blue-500 bg-white text-center"
                        placeholder="39"
                      />
                    </p>

                    <p className="flex items-start gap-2 flex-wrap">
                      <span>Lawyers, however, have raised objections to the use of plain English. They feel that it would result in ambiguity in documents and would mean people to lose faith in</span>
                      <input
                        type="text"
                        value={answers['40'] as string || ''}
                        onChange={(e) => handleInputChange('40', e.target.value)}
                        className="w-32 px-2 py-1 border-2 border-blue-500 bg-white text-center"
                        placeholder="40"
                      />
                      <span>as it would mean departing from language that has been used in the courts for a very long time.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
