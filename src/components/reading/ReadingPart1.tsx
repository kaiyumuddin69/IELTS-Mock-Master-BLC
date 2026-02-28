import { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { MoveHorizontal } from 'lucide-react';

export default function ReadingPart1() {
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
        <h2 className="font-bold">Part 1</h2>
        <p className="text-sm">Read the text and answer questions 1–13</p>
      </div>

      {/* Split View */}
      <div className="flex-1 flex overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Left: Reading Passage */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full overflow-y-auto p-6 ielts-scrollbar">
              <h2 className="text-xl font-bold mb-4">The life and work of Marie Curie</h2>
              
              <p className="mb-4">
                Marie Curie is probably the most famous woman scientist who has ever lived. Born Maria Sklodowska in Poland in 1867, she is famous for her work on radioactivity, and was twice a winner of the Nobel Prize. With her husband, Pierre Curie, and Henri Becquerel, she was awarded the 1903 Nobel Prize for Physics, and was then sole winner of the 1911 Nobel Prize for Chemistry. She was the first woman to win a Nobel Prize.
              </p>

              <p className="mb-4">
                From childhood, Marie was remarkable for her prodigious memory, and at the age of 16 won a gold medal on completion of her secondary education. Because her father lost his savings through bad investment, she then had to take work as a teacher. From her earnings she was able to finance her sister Bronya's medical studies in Paris, on the understanding that Bronya would, in turn, later help her to get an education.
              </p>

              <p className="mb-4">
                In 1891 this promise was fulfilled and Marie went to Paris and began to study at the Sorbonne (the University of Paris). She often worked far into the night and lived on little more than bread and butter and tea. She came first in the examination in the physical sciences in 1893, and in 1894 was placed second in the examination in mathematical sciences. It was not until the spring of that year that she was introduced to Pierre Curie.
              </p>

              <p className="mb-4">
                Their marriage in 1895 marked the start of a partnership that was soon to achieve results of world significance. Following Henri Becquerel's discovery in 1896 of a new phenomenon, which Marie later called 'radioactivity', Marie Curie decided to find out if the radioactivity discovered in uranium was to be found in other elements. She discovered that this was true for thorium.
              </p>

              <p className="mb-4">
                Turning her attention to minerals, she found her interest drawn to pitchblende, a mineral whose radioactivity, superior to that of pure uranium, could not be explained only by the presence in the ore of small quantities of an unknown substance of very high activity. Pierre Curie joined her in the work that she had undertaken to resolve this problem, and that led to the discovery of the new elements, polonium and radium. While Pierre Curie devoted himself chiefly to the physical study of the new radiations, Marie Curie struggled to obtain pure radium in the metallic state. This was achieved with the help of the chemist André-Louis Debierne, one of Pierre Curie's pupils. Based on the results of this research, Marie Curie received her Doctorate of Science, and in 1903 Marie and Pierre shared with Becquerel the Nobel Prize for Physics for the discovery of radioactivity.
              </p>

              <p className="mb-4">
                The sudden death of her husband in 1906 was a bitter blow to Marie Curie, but was also a turning point in her career: henceforth she was to devote all her energy to completing alone the work that they had undertaken. On May 13, 1906, she was appointed to the professorship that had been left vacant on her husband's death, becoming the first woman to teach at the Sorbonne. In 1911, she was awarded the 1911 Nobel Prize for Chemistry for the isolation of a pure form of radium.
              </p>

              <p className="mb-4">
                During World War I, Marie Curie, with the help of her daughter Irène, devoted herself to the development of the use of X-radiography, including the mobile units which came to be known as 'Little Curies', used for the examination of wounded soldiers. In 1918 the Radium Institute, whose staff Irène had joined, began to operate in earnest, and became a centre for nuclear physics and chemistry. Marie Curie, now at the highest point of her fame and, from 1922, a member of the Academy of Medicine, researched the chemistry of radioactive substances and their medical applications.
              </p>

              <p className="mb-4">
                In 1921, accompanied by her two daughters, Marie Curie made a triumphant journey to the United States to raise funds for research on radium. Women there presented her with a gram of radium for her campaign. Marie returned to Poland in 1913, visited Spain and Czechoslovakia in 1931, and in addition, had the satisfaction of seeing the development of the Curie Foundation in Paris, and the inauguration in 1932 in Warsaw of the Radium Institute, which she had founded in 1925.
              </p>

              <p className="mb-4">
                One of Marie Curie's outstanding achievements was to have understood the need to accumulate intense radioactive sources, not only to treat illness but also to maintain an abundant supply of radioactive materials for research purposes. The existence in Paris at the Radium Institute of a stock of 1.5 grams of radium made a decisive contribution to the success of the experiments undertaken in the years around 1930. This work prepared the way for the discovery of the neutron by Sir James Chadwick and, above all, for the discovery in 1934 by Irène and Frédéric Joliot-Curie of artificial radioactivity. A few months after this discovery, Marie Curie died as a result of leukaemia caused by exposure to radiation. She had often carried test tubes containing radioactive isotopes in her pocket, remarking on the pretty blue-green light they gave off.
              </p>

              <p className="mb-4">
                Her contribution to physics had been immense, not only in her own work, the importance of which had been demonstrated by her two Nobel Prizes, but because of her influence on subsequent generations of nuclear physicists and chemists.
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
              {/* Questions 1-6 */}
              <div className="mb-8">
                <h3 className="font-bold mb-3">Questions 1–6</h3>
                <p className="mb-4">
                  Choose <strong>TRUE</strong> if the statement agrees with the information given in the text, choose <strong>FALSE</strong> if the statement contradicts the information, or choose <strong>NOT GIVEN</strong> if there is no information on this.
                </p>

                <div className="space-y-6">
                  {[
                    { id: '1', text: "Marie Curie's husband was a joint winner of both Marie's Nobel Prizes" },
                    { id: '2', text: 'Marie became interested in science when she was a child' },
                    { id: '3', text: "Marie was able to attend the Sorbonne because of her sister's financial contribution" },
                    { id: '4', text: 'Marie stopped doing research for several years when her children were born' },
                  ].map((question) => (
                    <div key={question.id} className="bg-white border border-gray-300 p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="px-2 py-1 border border-gray-400 text-sm font-bold min-w-[28px] text-center">
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

              {/* Questions 7-13 */}
              <div className="mb-8">
                <h3 className="font-bold mb-3">Questions 7–13</h3>
                <p className="mb-4">
                  Complete the notes. Write <strong>ONE WORD ONLY</strong> from the text for each answer.
                </p>

                <h4 className="font-bold mb-4">Marie Curie's research on radioactivity</h4>

                <div className="bg-white border border-gray-300 p-4 space-y-4">
                  <ul className="list-disc list-inside space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <div className="flex items-center gap-2 flex-wrap flex-1">
                        <span>When uranium was discovered to be radioactive, Marie Curie found that the element called</span>
                        <input
                          type="text"
                          value={answers['7'] || ''}
                          onChange={(e) => handleInputChange('7', e.target.value)}
                          className="w-32 px-2 py-1 border-2 border-blue-500 bg-white text-center"
                          placeholder="7"
                        />
                        <span>had the same property.</span>
                      </div>
                    </li>

                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <div className="flex items-center gap-2 flex-wrap flex-1">
                        <span>Marie and Pierre Curie's research into the radioactivity of the mineral known as</span>
                        <input
                          type="text"
                          value={answers['8'] || ''}
                          onChange={(e) => handleInputChange('8', e.target.value)}
                          className="w-32 px-2 py-1 border-2 border-blue-500 bg-white text-center"
                          placeholder="8"
                        />
                        <span>led to the discovery of two new elements.</span>
                      </div>
                    </li>

                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <div className="flex items-center gap-2 flex-wrap flex-1">
                        <span>In 1911, Marie Curie received recognition for her work on the element</span>
                        <input
                          type="text"
                          value={answers['9'] || ''}
                          onChange={(e) => handleInputChange('9', e.target.value)}
                          className="w-32 px-2 py-1 border-2 border-blue-500 bg-white text-center"
                          placeholder="9"
                        />
                      </div>
                    </li>

                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <div className="flex items-center gap-2 flex-wrap flex-1">
                        <span>Marie and Irène Curie developed X-radiography which was used as a medical technique for</span>
                        <input
                          type="text"
                          value={answers['10'] || ''}
                          onChange={(e) => handleInputChange('10', e.target.value)}
                          className="w-32 px-2 py-1 border-2 border-blue-500 bg-white text-center"
                          placeholder="10"
                        />
                      </div>
                    </li>

                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <div className="flex items-center gap-2 flex-wrap flex-1">
                        <span>Marie saw the importance of collecting radioactive material both for research and for cases of</span>
                        <input
                          type="text"
                          value={answers['11'] || ''}
                          onChange={(e) => handleInputChange('11', e.target.value)}
                          className="w-32 px-2 py-1 border-2 border-blue-500 bg-white text-center"
                          placeholder="11"
                        />
                      </div>
                    </li>

                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <div className="flex items-center gap-2 flex-wrap flex-1">
                        <span>The radioactive material stocked in Paris contributed to the discoveries in the 1930s of the</span>
                        <input
                          type="text"
                          value={answers['12'] || ''}
                          onChange={(e) => handleInputChange('12', e.target.value)}
                          className="w-32 px-2 py-1 border-2 border-blue-500 bg-white text-center"
                          placeholder="12"
                        />
                        <span>and of what was known as artificial radioactivity.</span>
                      </div>
                    </li>

                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <div className="flex items-center gap-2 flex-wrap flex-1">
                        <span>During her research, Marie Curie was exposed to radiation and as a result she suffered from</span>
                        <input
                          type="text"
                          value={answers['13'] || ''}
                          onChange={(e) => handleInputChange('13', e.target.value)}
                          className="w-32 px-2 py-1 border-2 border-blue-500 bg-white text-center"
                          placeholder="13"
                        />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
