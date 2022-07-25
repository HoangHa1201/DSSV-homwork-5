const fs = require("fs");

class DataLoader {
    loaded_data;
    load(path) {
        let raw_data = fs.readFileSync(path);
        this.loaded_data = JSON.parse(raw_data);
    }
}

class StudentStore {
    student_list = new Array();
    ListCharScore = new Array();
    class_list = [];
    generate_from_data(data) {
        data.forEach((student_data) => {
            let scores = new ScoreData();
            scores.load_from_data(student_data);
            let student = new Student(student_data, scores);
            this.student_list.push(student);

            // Xử lý điểm min max
            var check = this.class_list.every((value) =>{
                return value !== student_data.lop;
            })
            if(check === true){
                this.class_list.push(student_data.lop);
            }

            // Xử lý điểm chữ
            let scoresChar = new ScoreCharData();
            scoresChar.load_from_dataChar(student_data);
            let studentCharScore = new Student(student_data, scoresChar);
            this.ListCharScore.push(studentCharScore);
        });
    }
    MinMax() {
        this.class_list.forEach((item) => {
            var arr2 = []
            this.student_list.forEach((a) => {
                if(a.student_class === item){
                    arr2.push({
                        id: a.student_id,
                        class: a.student_class,
                        score: a.score_data.aGv,
                    });
                }
            })
            var max = 0,min =0;
            
            var Maxresult = 0, Minresult = 0;
            arr2.forEach((a) => {
                if(a.score >= max){
                    max = a.score;
                    Maxresult = {
                        id: a.id,
                        class: a.class,
                        MaxScore: max,
                    }
                }
                if(a.score <= max){
                    min = a.score;
                    Minresult = {
                        id: a.id,
                        class: a.class,
                        MinScore: min,
                    }
                }
            })
            console.log("Max Score of class: ",Maxresult)
            console.log("Min Score of class: ",Minresult)
            console.log("----------------------------------------------------")
        })
    }
    PassedStudents() {
        return this.student_list.filter((student) => {
            return student.isPassed();
        });
    }
    classList() {
        return this.class_list
    }
}
class ScoreData {
    maths;
    physics;
    chemistry;
    english;
    aGv;
    load_from_data(data) {
        this.maths = data.diemToan;
        this.physics = data.diemLy;
        this.chemistry = data.diemHoa;
        this.english = data.diemAnh;
        this.aGv = (this.maths + this.physics + this.chemistry + this.english) / 4;
    }
    avg() {
        return this.aGv;
    }
}
class ScoreCharData {
    maths;
    physics;
    chemistry;
    english;
    aGv;
    load_from_dataChar(data) {
        var charScore = [];
        var AGV = (data.diemToan+data.diemLy+data.diemHoa+data.diemAnh)/4;
        var numScore = [data.diemToan, data.diemLy, data.diemHoa, data.diemAnh,AGV];
        numScore.forEach((paramt) => {
            if(paramt >= 8.5){
                charScore.push("A");
            }
            if(paramt >= 7 && paramt < 8.5){
                charScore.push("B");
            }
            if(paramt >= 5.5 && paramt < 7){
                charScore.push("C");
            }
            if(paramt >= 5 && paramt < 5.5){
                charScore.push("D+");
            }
            if(paramt >= 4 && paramt < 5){
                charScore.push("D");
            }if(paramt < 4){
                charScore.push("F");
            }
        })
        this.maths = charScore[0];
        this.physics = charScore[1];
        this.chemistry = charScore[2];
        this.english = charScore[3];
        this.aGv = charScore[4];
    }
}
class Student {
    student_id;
    score_data;
    student_class;
    constructor(student_data, score_data) {
        this.student_id = student_data.maSV;
        this.score_data = score_data;
        this.student_class = student_data.lop;
    }
    avg() {
        return this.score_data.avg();
    }
    isPassed() {
        return (this.score_data.physics >= 4 && this.score_data.chemistry >= 4 && this.score_data.maths >= 4 && this.score_data.english >= 4);
    }
}

const loader = new DataLoader();
loader.load("data.json"); 
const students = new StudentStore();
students.generate_from_data(loader.loaded_data);
console.log("List of students: ");
console.log(students.student_list);
console.log('Lowest and highest avg student');
console.log(students.MinMax());
console.log('All passed students');
console.log(students.PassedStudents());
console.log('List of students with char score: ');
console.log(students.ListCharScore);